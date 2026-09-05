import { usarLanzamientos } from '../datos/usarLanzamientos'
import { ORDEN_GENEROS, nombreGenero } from '../config/generos'
import { formatearFechaLarga } from '../formato'
import { TarjetaLanzamiento } from '../componentes/TarjetaLanzamiento'
import { AvisoOrigen } from '../componentes/AvisoOrigen'
import type { Lanzamiento } from '../datos/tipos'

/* Agrupa por género respetando el orden de la taxonomía;
   los géneros desconocidos van al final. */
function agruparPorGenero(lanzamientos: Lanzamiento[]): [string, Lanzamiento[]][] {
  const grupos = new Map<string, Lanzamiento[]>()
  for (const l of lanzamientos) {
    const lista = grupos.get(l.genero) ?? []
    lista.push(l)
    grupos.set(l.genero, lista)
  }
  const ordenados: [string, Lanzamiento[]][] = []
  for (const g of ORDEN_GENEROS) {
    const lista = grupos.get(g)
    if (lista) {
      ordenados.push([g, lista])
      grupos.delete(g)
    }
  }
  for (const [g, lista] of grupos) ordenados.push([g, lista])
  return ordenados
}

export function Hoy() {
  const { resultado, cargando } = usarLanzamientos()

  if (cargando || !resultado) {
    return <p className="py-10 text-center text-suave">Cargando novedades…</p>
  }

  const { lanzamientos } = resultado

  if (lanzamientos.length === 0) {
    return (
      <section>
        <h1 className="text-2xl font-extrabold">Hoy</h1>
        <AvisoOrigen resultado={resultado} />
        <p className="py-10 text-center text-suave">
          Aún no hay datos. Cuando la tarea de las 7:00 empiece a guardar novedades, aparecerán aquí.
        </p>
      </section>
    )
  }

  const ultimoDia = lanzamientos.reduce(
    (max, l) => (l.fecha_deteccion > max ? l.fecha_deteccion : max),
    lanzamientos[0]!.fecha_deteccion,
  )
  const delDia = lanzamientos.filter((l) => l.fecha_deteccion === ultimoDia)
  const grupos = agruparPorGenero(delDia)

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Hoy</h1>
      <p className="mb-3 mt-1 text-suave">
        Novedades del <strong className="text-texto">{formatearFechaLarga(ultimoDia)}</strong> ·{' '}
        {delDia.length} {delDia.length === 1 ? 'disco' : 'discos'}
      </p>
      <AvisoOrigen resultado={resultado} />
      {grupos.map(([genero, lista]) => (
        <div key={genero} className="mb-6">
          <h2 className="mb-2 border-b border-borde pb-1 text-lg font-bold text-acento">
            {nombreGenero(genero)} <span className="font-normal text-suave">({lista.length})</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lista.map((l) => (
              <TarjetaLanzamiento key={l.id} lanzamiento={l} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
