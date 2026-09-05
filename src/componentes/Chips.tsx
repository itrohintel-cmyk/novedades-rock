import { nombreGenero } from '../config/generos'

const BASE = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide'

/* NUEVO = grupo novel despuntando (resaltado en ámbar); CLÁSICO = consolidado. */
export function EtiquetaTipo({ tipo }: { tipo: 'NUEVO' | 'CLASICO' }) {
  if (tipo === 'NUEVO') {
    return <span className={`${BASE} bg-acento text-acento-texto`}>NUEVO</span>
  }
  return <span className={`${BASE} border border-suave/50 text-suave`}>CLÁSICO</span>
}

export function ChipGenero({ genero }: { genero: string }) {
  return <span className={`${BASE} border border-acento/50 text-acento`}>{nombreGenero(genero)}</span>
}

export function ChipReedicion() {
  return <span className={`${BASE} border border-suave/50 text-suave`}>REEDICIÓN</span>
}

export function ChipSubgenero({ subgenero }: { subgenero: string }) {
  return <span className={`${BASE} border border-borde text-suave`}>{subgenero.replaceAll('-', ' ')}</span>
}
