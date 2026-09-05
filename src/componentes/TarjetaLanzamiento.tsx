import { irADetalle } from '../navegacion'
import { Portada } from './Portada'
import { Distintivo } from './Distintivo'
import { BotonesEscucha } from './BotonesEscucha'
import { ChipGenero, ChipReedicion, EtiquetaTipo } from './Chips'
import type { Lanzamiento } from '../datos/tipos'

export function TarjetaLanzamiento({ lanzamiento }: { lanzamiento: Lanzamiento }) {
  const l = lanzamiento
  return (
    <article
      onClick={() => irADetalle(l.id)}
      className="cursor-pointer rounded-2xl border border-borde bg-tarjeta p-3 transition hover:border-acento/60"
    >
      <div className="flex gap-3">
        <Portada lanzamiento={l} className="h-28 w-28 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <EtiquetaTipo tipo={l.tipo_artista} />
              <ChipGenero genero={l.genero} />
              {l.es_reedicion && <ChipReedicion />}
            </div>
            <h3 className="mt-1.5 break-words text-lg font-bold leading-tight">{l.artista}</h3>
            <p className="mt-0.5 break-words text-suave">
              {l.titulo} · {l.anio}
            </p>
          </div>
          <Distintivo nota={l.puntuacion_media} />
        </div>
      </div>
      {l.resumen && <p className="mt-2.5 line-clamp-2 text-[15px] leading-snug text-suave">{l.resumen}</p>}
      <BotonesEscucha lanzamiento={l} />
    </article>
  )
}
