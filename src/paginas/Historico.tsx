import { useMemo, useState } from 'react'
import { usarLanzamientos } from '../datos/usarLanzamientos'
import { normalizarTexto } from '../formato'
import { TarjetaLanzamiento } from '../componentes/TarjetaLanzamiento'
import { AvisoOrigen } from '../componentes/AvisoOrigen'
import { FILTROS_INICIALES, Filtros, type EstadoFiltros } from '../componentes/Filtros'
import type { Lanzamiento } from '../datos/tipos'

function aplicarFiltros(lanzamientos: Lanzamiento[], filtros: EstadoFiltros): Lanzamiento[] {
  const texto = normalizarTexto(filtros.texto.trim())
  return lanzamientos.filter((l) => {
    if (filtros.genero !== 'todos' && l.genero !== filtros.genero) return false
    if (filtros.tipo !== 'todos' && l.tipo_artista !== filtros.tipo) return false
    if (filtros.notaMinima !== null) {
      if (l.puntuacion_media === null || l.puntuacion_media < filtros.notaMinima) return false
    }
    if (texto) {
      const pajar = normalizarTexto(`${l.artista} ${l.titulo}`)
      if (!pajar.includes(texto)) return false
    }
    return true
  })
}

export function Historico() {
  const { resultado, cargando } = usarLanzamientos()
  const [filtros, ponerFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES)

  const filtrados = useMemo(
    () => (resultado ? aplicarFiltros(resultado.lanzamientos, filtros) : []),
    [resultado, filtros],
  )

  if (cargando || !resultado) {
    return <p className="py-10 text-center text-suave">Cargando histórico…</p>
  }

  return (
    <section>
      <h1 className="mb-3 text-2xl font-extrabold">Histórico</h1>
      <AvisoOrigen resultado={resultado} />
      <Filtros filtros={filtros} alCambiar={ponerFiltros} />
      <p className="my-3 text-sm text-suave">
        {filtrados.length} de {resultado.lanzamientos.length}{' '}
        {resultado.lanzamientos.length === 1 ? 'disco' : 'discos'}
        {filtrados.length !== resultado.lanzamientos.length && (
          <>
            {' · '}
            <button
              type="button"
              onClick={() => ponerFiltros(FILTROS_INICIALES)}
              className="font-semibold text-acento underline-offset-2 hover:underline"
            >
              quitar filtros
            </button>
          </>
        )}
      </p>
      {filtrados.length === 0 ? (
        <p className="py-10 text-center text-suave">Ningún disco coincide con los filtros.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((l) => (
            <TarjetaLanzamiento key={l.id} lanzamiento={l} />
          ))}
        </div>
      )}
    </section>
  )
}
