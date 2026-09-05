import { GENEROS, ORDEN_GENEROS } from '../config/generos'

export interface EstadoFiltros {
  texto: string
  genero: 'todos' | string
  tipo: 'todos' | 'NUEVO' | 'CLASICO'
  notaMinima: number | null
}

export const FILTROS_INICIALES: EstadoFiltros = {
  texto: '',
  genero: 'todos',
  tipo: 'todos',
  notaMinima: null,
}

const CLASE_CAMPO =
  'h-11 rounded-xl border border-borde bg-tarjeta px-3 text-[15px] text-texto focus:border-acento focus:outline-none'

export function Filtros({
  filtros,
  alCambiar,
}: {
  filtros: EstadoFiltros
  alCambiar: (nuevos: EstadoFiltros) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        inputMode="search"
        placeholder="Buscar artista o título…"
        aria-label="Buscar por artista o título"
        value={filtros.texto}
        onChange={(e) => alCambiar({ ...filtros, texto: e.target.value })}
        className={`${CLASE_CAMPO} w-full placeholder:text-suave/70`}
      />
      <div className="grid grid-cols-3 gap-2">
        <select
          aria-label="Filtrar por género"
          value={filtros.genero}
          onChange={(e) => alCambiar({ ...filtros, genero: e.target.value })}
          className={CLASE_CAMPO}
        >
          <option value="todos">Género: todos</option>
          {ORDEN_GENEROS.map((g) => (
            <option key={g} value={g}>
              {GENEROS[g]}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por tipo de artista"
          value={filtros.tipo}
          onChange={(e) => alCambiar({ ...filtros, tipo: e.target.value as EstadoFiltros['tipo'] })}
          className={CLASE_CAMPO}
        >
          <option value="todos">Tipo: todos</option>
          <option value="NUEVO">Nuevos</option>
          <option value="CLASICO">Clásicos</option>
        </select>
        <select
          aria-label="Filtrar por puntuación mínima"
          value={filtros.notaMinima === null ? 'cualquiera' : String(filtros.notaMinima)}
          onChange={(e) =>
            alCambiar({
              ...filtros,
              notaMinima: e.target.value === 'cualquiera' ? null : Number(e.target.value),
            })
          }
          className={CLASE_CAMPO}
        >
          <option value="cualquiera">Nota: todas</option>
          <option value="6">6 o más</option>
          <option value="7">7 o más</option>
          <option value="8">8 o más</option>
          <option value="9">9 o más</option>
        </select>
      </div>
    </div>
  )
}
