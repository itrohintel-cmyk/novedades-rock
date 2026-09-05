import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { aplicarTema, temaGuardado } from './tema'
import './estilos.css'

aplicarTema(temaGuardado())

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
