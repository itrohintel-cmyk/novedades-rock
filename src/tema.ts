export type Tema = 'oscuro' | 'claro'

const CLAVE_TEMA = 'novedades-rock:tema'

export function temaGuardado(): Tema {
  try {
    return localStorage.getItem(CLAVE_TEMA) === 'claro' ? 'claro' : 'oscuro'
  } catch {
    return 'oscuro'
  }
}

export function aplicarTema(tema: Tema): void {
  document.documentElement.classList.toggle('claro', tema === 'claro')
  try {
    localStorage.setItem(CLAVE_TEMA, tema)
  } catch {
    /* si el almacenamiento no está disponible, el tema simplemente no se recuerda */
  }
}
