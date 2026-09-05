import { useState } from 'react'
import { inicialesArtista } from '../formato'
import type { Lanzamiento } from '../datos/tipos'

/* Portada cuadrada con carga diferida. Si no hay URL o la imagen falla,
   marcador con las iniciales del artista (sección 5.1 del PLAN). */
export function Portada({ lanzamiento, className = '' }: { lanzamiento: Lanzamiento; className?: string }) {
  const [fallo, ponerFallo] = useState(false)

  if (!lanzamiento.portada_url || fallo) {
    return (
      <div
        role="img"
        aria-label={`Portada no disponible de ${lanzamiento.titulo}, de ${lanzamiento.artista}`}
        className={`grid aspect-square select-none place-items-center overflow-hidden bg-gradient-to-br from-borde to-fondo font-black text-acento/80 ${className}`}
      >
        <span className="text-[2.2em] leading-none">{inicialesArtista(lanzamiento.artista)}</span>
      </div>
    )
  }

  return (
    <img
      src={lanzamiento.portada_url}
      alt={`Portada de ${lanzamiento.titulo}, de ${lanzamiento.artista}`}
      loading="lazy"
      onError={() => ponerFallo(true)}
      className={`aspect-square overflow-hidden object-cover ${className}`}
    />
  )
}
