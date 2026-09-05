import { useState, type ReactNode } from 'react'
import paquete from '../../package.json'
import {
  borrarCopiaLocal,
  endpointConfigurado,
  guardarEndpoint,
} from '../datos/cargarLanzamientos'
import { usarLanzamientos } from '../datos/usarLanzamientos'
import { formatearFechaHora } from '../formato'
import { aplicarTema, temaGuardado, type Tema } from '../tema'

const NOMBRE_ORIGEN: Record<string, string> = {
  endpoint: 'Servidor (Apps Script)',
  'copia-local': 'Copia guardada en este dispositivo',
  ejemplo: 'Datos de ejemplo (ficticios)',
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="mb-5 rounded-2xl border border-borde bg-tarjeta p-4">
      <h2 className="mb-3 text-lg font-bold text-acento">{titulo}</h2>
      {children}
    </div>
  )
}

const CLASE_BOTON =
  'min-h-11 rounded-xl px-4 font-semibold transition disabled:opacity-50'

export function Ajustes() {
  const { resultado, recargar } = usarLanzamientos()
  const [endpoint, ponerEndpoint] = useState(endpointConfigurado)
  const [mensaje, ponerMensaje] = useState('')
  const [tema, ponerTema] = useState<Tema>(temaGuardado)

  const guardar = () => {
    guardarEndpoint(endpoint)
    ponerMensaje('Guardado. Recargando datos…')
    recargar()
  }

  const cambiarTema = (nuevo: Tema) => {
    aplicarTema(nuevo)
    ponerTema(nuevo)
  }

  const borrarDatos = () => {
    if (window.confirm('¿Borrar la copia de datos guardada en este dispositivo? Se volverá a descargar del servidor cuando haya conexión.')) {
      borrarCopiaLocal()
      recargar()
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-extrabold">Ajustes</h1>

      <Seccion titulo="Fuente de datos">
        <label htmlFor="endpoint" className="mb-1 block text-sm text-suave">
          Dirección del servidor de datos (endpoint de Apps Script)
        </label>
        <input
          id="endpoint"
          type="url"
          value={endpoint}
          onChange={(e) => ponerEndpoint(e.target.value)}
          placeholder="https://script.google.com/macros/s/…/exec"
          className="h-11 w-full rounded-xl border border-borde bg-fondo px-3 text-[15px] focus:border-acento focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={guardar} className={`${CLASE_BOTON} bg-acento text-acento-texto`}>
            Guardar
          </button>
          {mensaje && <span className="text-sm text-suave">{mensaje}</span>}
        </div>
        {resultado && (
          <div className="mt-3 space-y-1 border-t border-borde pt-3 text-sm text-suave">
            <p>
              Datos actuales: <strong className="text-texto">{NOMBRE_ORIGEN[resultado.origen] ?? resultado.origen}</strong>{' '}
              · {resultado.lanzamientos.length} discos
            </p>
            {resultado.actualizado && <p>Última descarga correcta: {formatearFechaHora(resultado.actualizado)}</p>}
            {resultado.errores.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-semibold text-nota-media">
                  El servidor rechazó {resultado.errores.length}{' '}
                  {resultado.errores.length === 1 ? 'entrada mal formada' : 'entradas mal formadas'}
                </summary>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {resultado.errores.map((e) => (
                    <li key={e} className="break-words">{e}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </Seccion>

      <Seccion titulo="Apariencia">
        <div className="flex gap-2" role="radiogroup" aria-label="Tema de la aplicación">
          <button
            type="button"
            role="radio"
            aria-checked={tema === 'oscuro'}
            onClick={() => cambiarTema('oscuro')}
            className={`${CLASE_BOTON} flex-1 border ${tema === 'oscuro' ? 'border-acento bg-acento/15 text-acento' : 'border-borde text-suave'}`}
          >
            Tema oscuro
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={tema === 'claro'}
            onClick={() => cambiarTema('claro')}
            className={`${CLASE_BOTON} flex-1 border ${tema === 'claro' ? 'border-acento bg-acento/15 text-acento' : 'border-borde text-suave'}`}
          >
            Tema claro
          </button>
        </div>
      </Seccion>

      <Seccion titulo="Almacenamiento">
        <p className="mb-2 text-sm text-suave">
          La app guarda una copia de los datos para poder abrirse sin conexión.
        </p>
        <button type="button" onClick={borrarDatos} className={`${CLASE_BOTON} border border-borde text-texto hover:border-nota-baja`}>
          Borrar copia local de datos
        </button>
      </Seccion>

      <Seccion titulo="Acerca de">
        <p className="text-sm text-suave">
          Novedades Rock · versión {paquete.version}
          <br />
          App personal de novedades discográficas de rock y metal.
        </p>
      </Seccion>
    </section>
  )
}
