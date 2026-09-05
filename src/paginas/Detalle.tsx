import { useEffect } from 'react'
import { usarLanzamientos } from '../datos/usarLanzamientos'
import { volver } from '../navegacion'
import { formatearFechaLarga, formatearNota } from '../formato'
import { Portada } from '../componentes/Portada'
import { Distintivo } from '../componentes/Distintivo'
import { BotonesEscucha } from '../componentes/BotonesEscucha'
import { ChipGenero, ChipReedicion, ChipSubgenero, EtiquetaTipo } from '../componentes/Chips'

const ND = <span className="text-suave/70">N/D</span>

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  return (
    <div className="rounded-xl border border-borde bg-tarjeta px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-suave">{etiqueta}</dt>
      <dd className="mt-0.5 font-semibold">{valor ?? ND}</dd>
    </div>
  )
}

export function Detalle({ id }: { id: string }) {
  const { resultado, cargando } = usarLanzamientos()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (cargando || !resultado) {
    return <p className="py-10 text-center text-suave">Cargando…</p>
  }

  const l = resultado.lanzamientos.find((x) => x.id === id)

  if (!l) {
    return (
      <section>
        <BotonVolver />
        <p className="py-10 text-center text-suave">No se encuentra este disco en los datos cargados.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl">
      <BotonVolver />

      <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Portada lanzamiento={l} className="w-56 rounded-2xl sm:w-48" />
        <div className="w-full min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
            <EtiquetaTipo tipo={l.tipo_artista} />
            <ChipGenero genero={l.genero} />
            {l.subgenero && <ChipSubgenero subgenero={l.subgenero} />}
            {l.es_reedicion && <ChipReedicion />}
          </div>
          <h1 className="mt-2 break-words text-3xl font-extrabold leading-tight">{l.artista}</h1>
          <p className="mt-1 break-words text-xl text-suave">
            {l.titulo} <span className="text-suave/70">({l.anio})</span>
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
            <Distintivo nota={l.puntuacion_media} grande />
            <div className="text-left text-sm text-suave">
              <p className="font-semibold text-texto">Nota media de la crítica</p>
              <p>
                {l.puntuaciones.length === 0
                  ? 'Sin reseñas con nota todavía'
                  : `Según ${l.puntuaciones.length} ${l.puntuaciones.length === 1 ? 'fuente' : 'fuentes'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {l.resumen && <p className="mt-4 rounded-xl border border-borde bg-tarjeta p-3 leading-relaxed">{l.resumen}</p>}

      <BotonesEscucha lanzamiento={l} />

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <Dato etiqueta="Lanzamiento" valor={formatearFechaLarga(l.fecha_lanzamiento)} />
        <Dato etiqueta="Detectado" valor={formatearFechaLarga(l.fecha_deteccion)} />
        <Dato etiqueta="País" valor={l.pais} />
        <Dato etiqueta="Sello" valor={l.sello} />
      </dl>

      <h2 className="mt-6 text-lg font-bold text-acento">Temas destacados</h2>
      {l.tracklist_destacada.length === 0 ? (
        <p className="mt-1 text-suave">N/D</p>
      ) : (
        <ol className="mt-2 space-y-1.5">
          {l.tracklist_destacada.map((tema, i) => (
            <li key={tema} className="rounded-lg border border-borde bg-tarjeta px-3 py-2">
              <span className="mr-2 font-bold text-acento">{i + 1}.</span>
              {tema}
            </li>
          ))}
        </ol>
      )}

      <h2 className="mt-6 text-lg font-bold text-acento">Puntuaciones por fuente</h2>
      {l.puntuaciones.length === 0 ? (
        <p className="mt-1 text-suave">Sin reseñas con nota. (N/D)</p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-xl border border-borde">
          <table className="w-full border-collapse bg-tarjeta text-[15px]">
            <thead>
              <tr className="border-b border-borde text-left text-xs uppercase tracking-wide text-suave">
                <th className="px-3 py-2 font-semibold">Fuente</th>
                <th className="px-3 py-2 font-semibold">Nota original</th>
                <th className="px-3 py-2 font-semibold">Sobre 10</th>
                <th className="px-3 py-2 font-semibold">Reseña</th>
              </tr>
            </thead>
            <tbody>
              {l.puntuaciones.map((p) => (
                <tr key={`${p.fuente}-${p.valor_original}`} className="border-b border-borde last:border-b-0">
                  <td className="px-3 py-2.5 font-semibold">{p.fuente}</td>
                  <td className="px-3 py-2.5">{p.valor_original}</td>
                  <td className="px-3 py-2.5 font-bold text-acento">{formatearNota(p.sobre_10)}</td>
                  <td className="px-3 py-2.5">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-acento underline-offset-2 hover:underline"
                      >
                        Leer
                      </a>
                    ) : (
                      ND
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-6 text-lg font-bold text-acento">Fuentes</h2>
      <ul className="mb-6 mt-2 space-y-1.5">
        {l.fuentes.map((fuente) => (
          <li key={fuente}>
            <a
              href={fuente}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate rounded-lg border border-borde bg-tarjeta px-3 py-2 text-sm text-suave underline-offset-2 hover:text-acento hover:underline"
            >
              {fuente}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BotonVolver() {
  return (
    <button
      type="button"
      onClick={volver}
      className="-ml-2 flex min-h-11 items-center gap-1 rounded-xl px-2 font-semibold text-acento"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Volver
    </button>
  )
}
