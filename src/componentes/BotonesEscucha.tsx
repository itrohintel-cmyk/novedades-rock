import type { MouseEvent, ReactNode } from 'react'
import type { Lanzamiento } from '../datos/tipos'

const IconoPlay = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" fill="currentColor">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
)

const IconoNota = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" fill="currentColor">
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" />
  </svg>
)

function Boton({ url, etiqueta, icono, destacado }: { url: string | null; etiqueta: string; icono: ReactNode; destacado?: boolean }) {
  if (!url) {
    return (
      <span
        title="Enlace no disponible"
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-borde text-sm font-semibold text-suave/50"
      >
        {icono}
        {etiqueta} (N/D)
      </span>
    )
  }
  const clase = destacado
    ? 'bg-acento text-acento-texto hover:brightness-110'
    : 'border border-suave/40 text-texto hover:border-acento hover:text-acento'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(evento: MouseEvent) => evento.stopPropagation()}
      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${clase}`}
    >
      {icono}
      {etiqueta}
    </a>
  )
}

/* Botones de escucha (sección 6.1.4): abren la app nativa si está instalada. */
export function BotonesEscucha({ lanzamiento }: { lanzamiento: Lanzamiento }) {
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <Boton url={lanzamiento.youtube_video_url} etiqueta="Ver en YouTube" icono={IconoPlay} />
      <Boton url={lanzamiento.youtube_music_url} etiqueta="Escuchar en YouTube Music" icono={IconoNota} destacado />
    </div>
  )
}
