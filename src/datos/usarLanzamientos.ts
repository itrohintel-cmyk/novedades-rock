import { useCallback, useEffect, useState } from 'react'
import { cargarLanzamientos } from './cargarLanzamientos'
import type { ResultadoCarga } from './tipos'

/* Caché de la sesión: al cambiar de pestaña no se vuelve a descargar todo. */
let cacheSesion: ResultadoCarga | null = null
let promesaEnCurso: Promise<ResultadoCarga> | null = null

function obtener(): Promise<ResultadoCarga> {
  if (cacheSesion) return Promise.resolve(cacheSesion)
  promesaEnCurso ??= cargarLanzamientos().then((resultado) => {
    cacheSesion = resultado
    promesaEnCurso = null
    return resultado
  })
  return promesaEnCurso
}

export function usarLanzamientos() {
  const [resultado, ponerResultado] = useState<ResultadoCarga | null>(cacheSesion)

  useEffect(() => {
    let activo = true
    void obtener().then((r) => {
      if (activo) ponerResultado(r)
    })
    return () => {
      activo = false
    }
  }, [])

  const recargar = useCallback(() => {
    cacheSesion = null
    promesaEnCurso = null
    ponerResultado(null)
    void obtener().then(ponerResultado)
  }, [])

  return { resultado, cargando: resultado === null, recargar }
}
