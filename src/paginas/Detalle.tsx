import { volver } from '../navegacion'

export function Detalle({ id }: { id: string }) {
  return (
    <section>
      <button type="button" onClick={volver} className="min-h-11 text-acento">
        ← Volver
      </button>
      <h1 className="mt-2 text-2xl font-bold">Detalle</h1>
      <p className="mt-2 text-suave">Ficha del disco «{id}». (En construcción)</p>
    </section>
  )
}
