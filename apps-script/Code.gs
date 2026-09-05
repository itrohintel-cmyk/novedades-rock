/**
 * NOVEDADES ROCK — backend de lectura (Google Apps Script).
 *
 * doGet(): lee los ficheros AAAA-MM-DD.json de la carpeta NOVEDADES_ROCK de
 * Google Drive, valida cada entrada contra el esquema (docs/esquema-lanzamiento.json),
 * deduplica por id, ordena por fecha y devuelve:
 *   { lanzamientos: [...], errores: [...], generado: "..." }
 * Las entradas mal formadas NO se cuelan: se apuntan en `errores`.
 *
 * Despliegue: web app, ejecutar como el propietario, acceso "Cualquier usuario".
 * La respuesta se cachea unos minutos para no releer Drive en cada visita.
 */

var NOMBRE_CARPETA = 'NOVEDADES_ROCK';
var MINUTOS_CACHE = 20;

var GENEROS_PERMITIDOS = [
  'heavy-metal',
  'hard-rock',
  'glam',
  'sleaze',
  'rock-sureno',
  'gothic-metal',
  'rock-and-roll',
];

function doGet() {
  var cache = CacheService.getScriptCache();
  var clave = 'respuesta-v1';
  var cuerpo = cache.get(clave);
  if (!cuerpo) {
    cuerpo = JSON.stringify(construirRespuesta());
    // CacheService admite valores de hasta ~100 KB; si el histórico crece más, se sirve sin caché.
    if (cuerpo.length < 95000) {
      cache.put(clave, cuerpo, MINUTOS_CACHE * 60);
    }
  }
  return ContentService.createTextOutput(cuerpo).setMimeType(ContentService.MimeType.JSON);
}

function construirRespuesta() {
  var errores = [];
  var validos = [];

  var carpetas = DriveApp.getFoldersByName(NOMBRE_CARPETA);
  if (!carpetas.hasNext()) {
    return {
      lanzamientos: [],
      errores: ['No existe la carpeta ' + NOMBRE_CARPETA + ' en Drive (se creará cuando arranque la tarea diaria).'],
      generado: new Date().toISOString(),
    };
  }

  var ficheros = carpetas.next().getFiles();
  while (ficheros.hasNext()) {
    var fichero = ficheros.next();
    var nombre = fichero.getName();
    if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(nombre)) continue;
    try {
      var datos = JSON.parse(fichero.getBlob().getDataAsString('UTF-8'));
      if (!Array.isArray(datos)) {
        errores.push(nombre + ': el contenido no es un array');
        continue;
      }
      for (var i = 0; i < datos.length; i++) {
        var problema = validarLanzamiento(datos[i]);
        if (problema) {
          errores.push(nombre + ' [entrada ' + i + ']: ' + problema);
        } else {
          validos.push(datos[i]);
        }
      }
    } catch (e) {
      errores.push(nombre + ': JSON ilegible (' + e + ')');
    }
  }

  return {
    lanzamientos: ordenarPorFecha(deduplicar(validos)),
    errores: errores,
    generado: new Date().toISOString(),
  };
}

/* Devuelve null si la entrada es válida; si no, el motivo del rechazo. */
function validarLanzamiento(l) {
  if (typeof l !== 'object' || l === null || Array.isArray(l)) return 'no es un objeto';

  var textoObligatorio = ['id', 'fecha_lanzamiento', 'fecha_deteccion', 'artista', 'titulo', 'genero'];
  for (var i = 0; i < textoObligatorio.length; i++) {
    var campo = textoObligatorio[i];
    if (typeof l[campo] !== 'string' || l[campo].length === 0) return 'falta o está vacío ' + campo;
  }
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(l.id)) return 'id con formato incorrecto';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.fecha_lanzamiento)) return 'fecha_lanzamiento con formato incorrecto';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.fecha_deteccion)) return 'fecha_deteccion con formato incorrecto';
  if (GENEROS_PERMITIDOS.indexOf(l.genero) === -1) return 'género no permitido: ' + l.genero;
  if (typeof l.anio !== 'number' || l.anio < 1950 || l.anio > 2100) return 'anio inválido';
  if (l.tipo_artista !== 'NUEVO' && l.tipo_artista !== 'CLASICO') return 'tipo_artista debe ser NUEVO o CLASICO';
  if (typeof l.es_reedicion !== 'boolean') return 'es_reedicion debe ser true o false';

  var nulosOTexto = ['subgenero', 'pais', 'sello', 'portada_url', 'resumen', 'youtube_video_url', 'youtube_music_url'];
  for (var j = 0; j < nulosOTexto.length; j++) {
    var campoNulo = nulosOTexto[j];
    if (!(campoNulo in l)) return 'falta el campo ' + campoNulo;
    if (l[campoNulo] !== null && typeof l[campoNulo] !== 'string') return campoNulo + ' debe ser texto o null';
  }

  if (!Array.isArray(l.tracklist_destacada)) return 'tracklist_destacada debe ser un array';
  if (!Array.isArray(l.fuentes) || l.fuentes.length < 1) return 'fuentes es obligatorio (mínimo una URL)';
  if (!Array.isArray(l.puntuaciones)) return 'puntuaciones debe ser un array';

  for (var k = 0; k < l.puntuaciones.length; k++) {
    var p = l.puntuaciones[k];
    if (typeof p !== 'object' || p === null) return 'puntuación ' + k + ' mal formada';
    if (typeof p.fuente !== 'string' || typeof p.valor_original !== 'string') return 'puntuación ' + k + ' sin fuente o valor_original';
    if (typeof p.sobre_10 !== 'number' || p.sobre_10 < 0 || p.sobre_10 > 10) return 'puntuación ' + k + ' con sobre_10 inválido';
    if (p.url !== null && typeof p.url !== 'string') return 'puntuación ' + k + ' con url inválida';
  }

  if (l.puntuacion_media !== null && typeof l.puntuacion_media !== 'number') return 'puntuacion_media debe ser número o null';
  if (l.puntuaciones.length === 0 && l.puntuacion_media !== null) return 'puntuacion_media sin puntuaciones (las notas nunca se estiman)';

  return null;
}

/* Con el mismo id (el mismo disco detectado dos días), gana la entrada más completa. */
function completitud(l) {
  var puntos = 0;
  if (l.portada_url) puntos += 2;
  if (l.resumen) puntos += 1;
  if (l.youtube_video_url) puntos += 1;
  if (l.youtube_music_url) puntos += 2;
  if (l.sello) puntos += 1;
  if (l.pais) puntos += 1;
  if (l.subgenero) puntos += 1;
  puntos += Math.min(l.puntuaciones.length, 4);
  puntos += Math.min(l.tracklist_destacada.length, 3);
  return puntos;
}

function deduplicar(lanzamientos) {
  var porId = {};
  for (var i = 0; i < lanzamientos.length; i++) {
    var l = lanzamientos[i];
    var existente = porId[l.id];
    if (!existente) {
      porId[l.id] = l;
    } else {
      var gana =
        completitud(l) > completitud(existente) ||
        (completitud(l) === completitud(existente) && l.fecha_deteccion > existente.fecha_deteccion);
      if (gana) porId[l.id] = l;
    }
  }
  var resultado = [];
  for (var id in porId) resultado.push(porId[id]);
  return resultado;
}

function ordenarPorFecha(lanzamientos) {
  return lanzamientos.sort(function (a, b) {
    if (a.fecha_lanzamiento !== b.fecha_lanzamiento) {
      return a.fecha_lanzamiento < b.fecha_lanzamiento ? 1 : -1;
    }
    return a.artista.localeCompare(b.artista);
  });
}
