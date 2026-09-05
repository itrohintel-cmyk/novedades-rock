import type { ReactNode } from 'react'
import { irA } from '../navegacion'

interface Pestana {
  destino: 'hoy' | 'historico' | 'ajustes'
  etiqueta: string
  icono: ReactNode
}

const grosorIcono = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const PESTANAS: Pestana[] = [
  {
    destino: 'hoy',
    etiqueta: 'Hoy',
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...grosorIcono}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" opacity="0.5" />
      </svg>
    ),
  },
  {
    destino: 'historico',
    etiqueta: 'Histórico',
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...grosorIcono}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
  {
    destino: 'ajustes',
    etiqueta: 'Ajustes',
    icono: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" {...grosorIcono}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    ),
  },
]

export function BarraNavegacion({ actual }: { actual: 'hoy' | 'historico' | 'ajustes' }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 border-t border-borde bg-tarjeta pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-5xl">
        {PESTANAS.map((p) => (
          <button
            key={p.destino}
            type="button"
            onClick={() => irA(p.destino)}
            aria-current={actual === p.destino ? 'page' : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-sm ${
              actual === p.destino ? 'font-semibold text-acento' : 'text-suave'
            }`}
          >
            {p.icono}
            {p.etiqueta}
          </button>
        ))}
      </div>
    </nav>
  )
}
