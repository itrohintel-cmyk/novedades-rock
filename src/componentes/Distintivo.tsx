import { formatearNota } from '../formato'

/* Distintivo de puntuación media (sección 7 del PLAN):
   ≥ 8 verde · 6-7,9 ámbar · < 6 gris · sin nota "N/D" en gris apagado. */
export function Distintivo({ nota, grande = false }: { nota: number | null; grande?: boolean }) {
  const tamano = grande
    ? 'h-20 w-20 rounded-2xl text-3xl'
    : 'h-14 w-14 rounded-xl text-xl'

  if (nota === null) {
    return (
      <div
        aria-label="Puntuación no disponible"
        className={`${tamano} grid shrink-0 place-items-center border border-borde font-bold text-suave/70`}
      >
        N/D
      </div>
    )
  }

  const color =
    nota >= 8
      ? 'bg-nota-alta text-white'
      : nota >= 6
        ? 'bg-nota-media text-[#1c1409]'
        : 'bg-nota-baja text-white'

  return (
    <div
      aria-label={`Puntuación media ${formatearNota(nota)} sobre 10`}
      className={`${tamano} grid shrink-0 place-items-center font-extrabold ${color}`}
    >
      {formatearNota(nota)}
    </div>
  )
}
