/* Utilidades de formato en castellano. */

export function formatearFechaLarga(fechaIso: string): string {
  const fecha = new Date(`${fechaIso}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) return fechaIso
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatearFechaCorta(fechaIso: string): string {
  const fecha = new Date(`${fechaIso}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) return fechaIso
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatearFechaHora(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return iso
  return fecha.toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/* Nota con coma decimal española: 8.2 → "8,2". */
export function formatearNota(valor: number): string {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/* Para buscar sin que importen mayúsculas ni tildes. */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

/* Iniciales del artista para el marcador de portada ausente. */
export function inicialesArtista(nombre: string): string {
  const palabras = nombre.split(/\s+/).filter((p) => p.length > 0)
  return palabras
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}
