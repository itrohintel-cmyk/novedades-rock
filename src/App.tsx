import { usarRuta } from './navegacion'
import { BarraNavegacion } from './componentes/BarraNavegacion'
import { Hoy } from './paginas/Hoy'
import { Historico } from './paginas/Historico'
import { Ajustes } from './paginas/Ajustes'
import { Detalle } from './paginas/Detalle'

export function App() {
  const ruta = usarRuta()
  return (
    <div className="min-h-dvh bg-fondo text-texto">
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4">
        {ruta.pagina === 'hoy' && <Hoy />}
        {ruta.pagina === 'historico' && <Historico />}
        {ruta.pagina === 'ajustes' && <Ajustes />}
        {ruta.pagina === 'detalle' && <Detalle id={ruta.id} />}
      </main>
      {ruta.pagina !== 'detalle' && <BarraNavegacion actual={ruta.pagina} />}
    </div>
  )
}
