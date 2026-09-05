import { formatearFechaHora } from '../formato'
import type { ResultadoCarga } from '../datos/tipos'

/* Franja informativa cuando los datos no vienen del endpoint en directo. */
export function AvisoOrigen({ resultado }: { resultado: ResultadoCarga }) {
  if (resultado.origen === 'ejemplo') {
    return (
      <p className="mb-4 rounded-xl border border-acento/50 bg-acento/10 px-3 py-2 text-sm text-texto">
        Estás viendo <strong>datos de EJEMPLO</strong> (discos y grupos ficticios). Cuando el
        endpoint esté configurado en Ajustes, aquí saldrán las novedades reales.
      </p>
    )
  }
  if (resultado.origen === 'copia-local') {
    return (
      <p className="mb-4 rounded-xl border border-borde bg-tarjeta px-3 py-2 text-sm text-suave">
        Sin conexión con el servidor: mostrando la última copia guardada
        {resultado.actualizado ? ` (${formatearFechaHora(resultado.actualizado)})` : ''}.
      </p>
    )
  }
  return null
}
