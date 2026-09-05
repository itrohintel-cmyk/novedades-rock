/* Tipos del modelo de datos (sección 5.1 del PLAN).
   El contrato formal está en docs/esquema-lanzamiento.json. */

export interface Puntuacion {
  fuente: string
  valor_original: string
  sobre_10: number
  url: string | null
}

export interface Lanzamiento {
  id: string
  fecha_lanzamiento: string
  fecha_deteccion: string
  artista: string
  titulo: string
  anio: number
  /* Normalmente uno de los slugs de GENEROS; se deja abierto para no romper
     la app si el pipeline enviara un valor nuevo. */
  genero: string
  subgenero: string | null
  tipo_artista: 'NUEVO' | 'CLASICO'
  pais: string | null
  sello: string | null
  es_reedicion: boolean
  portada_url: string | null
  resumen: string | null
  tracklist_destacada: string[]
  puntuaciones: Puntuacion[]
  puntuacion_media: number | null
  youtube_video_url: string | null
  youtube_music_url: string | null
  fuentes: string[]
}

export type OrigenDatos = 'endpoint' | 'copia-local' | 'ejemplo'

export interface ResultadoCarga {
  lanzamientos: Lanzamiento[]
  origen: OrigenDatos
  /* Fecha-hora ISO de la última descarga correcta del endpoint, o null. */
  actualizado: string | null
  /* Avisos del Apps Script (entradas rechazadas por no cumplir el esquema). */
  errores: string[]
}
