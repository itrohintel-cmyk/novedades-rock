import { useEffect, useState } from 'react'

/* Navegación por hash (#/hoy, #/historico, #/ajustes, #/disco/<id>).
   Funciona en GitHub Pages sin configuración de servidor y sin dependencias. */

export type Ruta =
  | { pagina: 'hoy' }
  | { pagina: 'historico' }
  | { pagina: 'ajustes' }
  | { pagina: 'detalle'; id: string }

export function interpretarHash(hash: string): Ruta {
  const limpio = hash.replace(/^#\/?/, '')
  if (limpio.startsWith('disco/')) {
    return { pagina: 'detalle', id: decodeURIComponent(limpio.slice('disco/'.length)) }
  }
  if (limpio === 'historico') return { pagina: 'historico' }
  if (limpio === 'ajustes') return { pagina: 'ajustes' }
  return { pagina: 'hoy' }
}

export function usarRuta(): Ruta {
  const [ruta, ponerRuta] = useState<Ruta>(() => interpretarHash(window.location.hash))
  useEffect(() => {
    const alCambiar = () => ponerRuta(interpretarHash(window.location.hash))
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return ruta
}

export function irA(destino: 'hoy' | 'historico' | 'ajustes'): void {
  window.location.hash = `/${destino}`
}

export function irADetalle(id: string): void {
  window.location.hash = `/disco/${encodeURIComponent(id)}`
}

export function volver(): void {
  window.history.back()
}
