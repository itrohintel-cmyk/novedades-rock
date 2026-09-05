import ejemploCrudo from '../../data/ejemplo-lanzamientos.json'
import type { Lanzamiento, ResultadoCarga } from './tipos'

/* Cadena de carga (sección 6.1.7 del PLAN):
   1) endpoint de Apps Script (URL configurable en Ajustes)
   2) si falla, la última copia buena guardada en localStorage
   3) si no hay nada, los datos de ejemplo ficticios empaquetados con la app */

const CLAVE_ENDPOINT = 'novedades-rock:endpoint'
const CLAVE_COPIA = 'novedades-rock:copia-datos'
const CLAVE_ACTUALIZADO = 'novedades-rock:actualizado'

/* Se rellena al desplegar el Apps Script (Bloque 6); puede sobrescribirse en Ajustes. */
export const ENDPOINT_POR_DEFECTO = ''

export function endpointConfigurado(): string {
  try {
    const guardado = localStorage.getItem(CLAVE_ENDPOINT)
    if (guardado !== null) return guardado.trim()
  } catch {
    /* almacenamiento no disponible */
  }
  return ENDPOINT_POR_DEFECTO
}

export function guardarEndpoint(url: string): void {
  try {
    localStorage.setItem(CLAVE_ENDPOINT, url.trim())
  } catch {
    /* almacenamiento no disponible */
  }
}

export function borrarCopiaLocal(): void {
  try {
    localStorage.removeItem(CLAVE_COPIA)
    localStorage.removeItem(CLAVE_ACTUALIZADO)
  } catch {
    /* almacenamiento no disponible */
  }
}

/* Validación ligera: espejo de los campos obligatorios del esquema.
   Protege la app de entradas mal formadas si el backend dejara pasar alguna. */
function esLanzamientoValido(valor: unknown): valor is Lanzamiento {
  if (typeof valor !== 'object' || valor === null) return false
  const l = valor as Record<string, unknown>
  return (
    typeof l.id === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(l.fecha_lanzamiento)) &&
    typeof l.artista === 'string' &&
    l.artista.length > 0 &&
    typeof l.titulo === 'string' &&
    l.titulo.length > 0 &&
    typeof l.anio === 'number' &&
    typeof l.genero === 'string' &&
    (l.tipo_artista === 'NUEVO' || l.tipo_artista === 'CLASICO') &&
    typeof l.es_reedicion === 'boolean' &&
    Array.isArray(l.tracklist_destacada) &&
    Array.isArray(l.puntuaciones) &&
    Array.isArray(l.fuentes) &&
    (l.puntuacion_media === null || typeof l.puntuacion_media === 'number')
  )
}

function filtrarValidos(valores: unknown[]): Lanzamiento[] {
  return valores.filter(esLanzamientoValido)
}

/* Cuanta más información tiene una entrada, más "completa" es.
   Se usa para decidir cuál conservar al deduplicar por id. */
function completitud(l: Lanzamiento): number {
  let puntos = 0
  if (l.portada_url) puntos += 2
  if (l.resumen) puntos += 1
  if (l.youtube_video_url) puntos += 1
  if (l.youtube_music_url) puntos += 2
  if (l.sello) puntos += 1
  if (l.pais) puntos += 1
  if (l.subgenero) puntos += 1
  puntos += Math.min(l.puntuaciones.length, 4)
  puntos += Math.min(l.tracklist_destacada.length, 3)
  return puntos
}

export function deduplicar(lanzamientos: Lanzamiento[]): Lanzamiento[] {
  const porId = new Map<string, Lanzamiento>()
  for (const l of lanzamientos) {
    const existente = porId.get(l.id)
    if (!existente) {
      porId.set(l.id, l)
      continue
    }
    const gana =
      completitud(l) > completitud(existente) ||
      (completitud(l) === completitud(existente) && l.fecha_deteccion > existente.fecha_deteccion)
    if (gana) porId.set(l.id, l)
  }
  return [...porId.values()]
}

export function ordenarPorFecha(lanzamientos: Lanzamiento[]): Lanzamiento[] {
  return [...lanzamientos].sort(
    (a, b) =>
      b.fecha_lanzamiento.localeCompare(a.fecha_lanzamiento) || a.artista.localeCompare(b.artista, 'es'),
  )
}

function prepararConjunto(valores: unknown[]): Lanzamiento[] {
  return ordenarPorFecha(deduplicar(filtrarValidos(valores)))
}

function leerCopiaLocal(): { lanzamientos: Lanzamiento[]; actualizado: string | null } | null {
  try {
    const crudo = localStorage.getItem(CLAVE_COPIA)
    if (!crudo) return null
    const datos: unknown = JSON.parse(crudo)
    if (!Array.isArray(datos)) return null
    const lanzamientos = prepararConjunto(datos)
    if (lanzamientos.length === 0) return null
    return { lanzamientos, actualizado: localStorage.getItem(CLAVE_ACTUALIZADO) }
  } catch {
    return null
  }
}

function guardarCopiaLocal(lanzamientos: Lanzamiento[], momento: string): void {
  try {
    localStorage.setItem(CLAVE_COPIA, JSON.stringify(lanzamientos))
    localStorage.setItem(CLAVE_ACTUALIZADO, momento)
  } catch {
    /* si no cabe o no hay almacenamiento, la app sigue funcionando online */
  }
}

/* La respuesta del Apps Script es { lanzamientos: [...], errores: [...] };
   también se acepta un array a secas por si la fuente cambia en el futuro. */
function interpretarRespuesta(cuerpo: unknown): { crudos: unknown[]; errores: string[] } {
  if (Array.isArray(cuerpo)) return { crudos: cuerpo, errores: [] }
  if (typeof cuerpo === 'object' && cuerpo !== null) {
    const r = cuerpo as Record<string, unknown>
    if (Array.isArray(r.lanzamientos)) {
      const errores = Array.isArray(r.errores) ? r.errores.map((e) => String(e)) : []
      return { crudos: r.lanzamientos, errores }
    }
  }
  throw new Error('La respuesta del endpoint no tiene el formato esperado')
}

export async function cargarLanzamientos(): Promise<ResultadoCarga> {
  const endpoint = endpointConfigurado()

  if (endpoint) {
    try {
      const respuesta = await fetch(endpoint, {
        signal: AbortSignal.timeout(20000),
        redirect: 'follow',
      })
      if (!respuesta.ok) throw new Error(`El endpoint respondió ${respuesta.status}`)
      const { crudos, errores } = interpretarRespuesta(await respuesta.json())
      const lanzamientos = prepararConjunto(crudos)
      const momento = new Date().toISOString()
      guardarCopiaLocal(lanzamientos, momento)
      return { lanzamientos, origen: 'endpoint', actualizado: momento, errores }
    } catch {
      const copia = leerCopiaLocal()
      if (copia) {
        return { ...copia, origen: 'copia-local', errores: [] }
      }
      /* sin conexión y sin copia: se cae a los ejemplos */
    }
  } else {
    const copia = leerCopiaLocal()
    if (copia) {
      return { ...copia, origen: 'copia-local', errores: [] }
    }
  }

  return {
    lanzamientos: prepararConjunto(ejemploCrudo as unknown[]),
    origen: 'ejemplo',
    actualizado: null,
    errores: [],
  }
}
