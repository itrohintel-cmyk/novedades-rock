/* ÚNICO lugar donde viven la taxonomía de géneros y la lista de exclusión
   (sección 5.2 del PLAN + decisiones de Iñigo del 6-9-2026). */

export const GENEROS = {
  'heavy-metal': 'Heavy Metal',
  'hard-rock': 'Hard Rock',
  'glam': 'Glam Rock / Glam Metal',
  'sleaze': 'Sleaze Rock',
  'rock-sureno': 'Rock Sureño',
  'gothic-metal': 'Gothic Metal',
  'rock-and-roll': 'Rock and Roll (duro)',
} as const

export type Genero = keyof typeof GENEROS

/* Orden en el que se muestran los grupos de género en la pantalla "Hoy". */
export const ORDEN_GENEROS: Genero[] = [
  'heavy-metal',
  'hard-rock',
  'glam',
  'sleaze',
  'rock-sureno',
  'gothic-metal',
  'rock-and-roll',
]

/* Estilos que nunca deben aparecer en la app. Decisión de Iñigo (6-9-2026):
   metalcore, nu-metal y deathcore quedan excluidos; del thrash solo se admite
   el clásico de corte heavy (como subgénero de heavy-metal). */
export const LISTA_EXCLUSION = [
  'punk',
  'hardcore punk',
  'pop punk',
  'pop',
  'pop rock blando',
  'indie pop',
  'metalcore',
  'nu-metal',
  'deathcore',
  'música clásica',
  'bandas sonoras orquestales',
  'latino',
  'reguetón',
  'bachata',
  'trap',
  'hip hop',
  'electrónica',
] as const

export function esGeneroConocido(valor: string): valor is Genero {
  return valor in GENEROS
}

/* Nombre legible de un género; si llega un slug desconocido, se muestra tal cual. */
export function nombreGenero(valor: string): string {
  return esGeneroConocido(valor) ? GENEROS[valor] : valor
}
