# PLAN DE DESARROLLO — "NOVEDADES ROCK" (app web de lanzamientos de rock/metal)

Documento de especificación para Claude Code. Propietario: Iñigo.
Versión 1.1 — 5 de septiembre de 2026 (corrección: rock sureño).

---

## 0. Instrucciones para Claude Code (LEER PRIMERO)

Este documento lo ha preparado Claude (Cowork) junto con Iñigo, que es el propietario y usuario final de la app. Ten en cuenta lo siguiente durante todo el proyecto:

1. **Iñigo no es programador.** Es técnico electricista. No sabe ni quiere aprender a programar. Tu trabajo es hacerlo TODO: código, configuración, despliegue y pruebas. Cuando necesites que él haga algo (crear una cuenta, pegar una clave, aprobar un permiso), explícaselo paso a paso, en castellano, sin jerga y sin dar nada por supuesto.
2. **Habla siempre en castellano (España).**
3. **No inventes datos.** Si un dato no está disponible (una puntuación, una portada, un enlace), se marca como "N/D". Nunca se rellena con estimaciones. Esto aplica al código, a los datos de ejemplo y a la lógica del pipeline.
4. **Pregunta antes de decidir cosas de producto.** Las decisiones técnicas internas son tuyas; las decisiones que afectan a lo que Iñigo ve o paga (qué servicio usar, si hace falta una clave API de pago, cambiar el diseño) se consultan primero. La sección 12 lista las decisiones pendientes.
5. **Simplicidad ante todo.** Menos dependencias, menos servicios, menos cuentas. Si algo se puede hacer con un fichero JSON estático en vez de una base de datos, se hace con el JSON.
6. **Trabaja por fases** (sección 6). No empieces la Fase 2 sin que la Fase 1 esté funcionando y desplegada, y sin que Iñigo la haya visto.
7. **Commits pequeños y descriptivos.** Al terminar cada bloque de trabajo, resume en 3-4 líneas qué se ha hecho y qué falta.
8. **Antes de escribir código, entra en modo plan**, revisa este documento completo, haz las preguntas que tengas y propón el orden de trabajo.

---

## 1. Objetivo

Una aplicación web (PWA, instalable en móvil y PC) que muestre cada día las **novedades discográficas más relevantes** (solo LPs / álbumes completos) de los géneros que le interesan a Iñigo, con **portada, puntuación de la crítica especializada, tracklist breve y enlaces a YouTube y YouTube Music**, y que conserve un **histórico consultable** con filtros.

Sustituye/complementa un aviso diario que Iñigo ya recibe a las 7:00 (tarea programada de Claude). La app es el "archivo" visual y navegable de esos avisos.

## 2. Alcance

**Dentro del alcance**

- Solo **LPs / álbumes completos** (nuevos lanzamientos y reediciones relevantes de clásicos).
- Dos tipos de artista: **NUEVO** (grupo novel que está despuntando) y **CLÁSICO** (grupo consolidado).
- Géneros (taxonomía en sección 5.2): heavy metal y variantes, hard rock y variantes, glam rock/metal, sleaze rock, rock sureño, gothic metal, rock and roll clásico de sonido duro.
- Histórico completo desde el día que arranque el pipeline.
- Uso principal desde el móvil; también desde PC.

**Fuera del alcance (no incluir nunca)**

- Singles, EPs, directos sin interés, recopilatorios de relleno.
- Punk (y derivados), música clásica (antigua o contemporánea), música latina/sudamericana (bachata, reguetón, etc.), pop (antiguo o actual).
- Conciertos y giras (puede ser una fase futura, ver 6.4).
- Disponibilidad de formatos físicos (vinilo/CD): no es relevante para Iñigo.
- Enlaces a Spotify, Apple Music, Amazon: Iñigo usa **YouTube Music**. Solo YouTube y YouTube Music.
- Cuentas de usuario, login, multiusuario. Es una app personal.

## 3. Usuario y contexto de uso

- Un único usuario (Iñigo). Móvil Android como uso principal, PC Windows en la oficina.
- Momento de uso típico: por la mañana con el aviso de las 7:00, y ratos sueltos para repasar el histórico y escuchar en YouTube Music.
- Idioma de la interfaz: castellano.
- Iñigo ya tiene experiencia (como usuario, no como programador) con: Google Sheets, Google Drive, Google Apps Script desplegado como web app (proyecto anterior de sincronización de obras), PWA instaladas en el móvil.

## 4. Arquitectura

### 4.1 Opción recomendada — "Opción B: reutilizar lo que ya existe"

Reutiliza la tarea programada de Claude que ya funciona y evita claves API de pago.

```
[Tarea programada Claude, 7:00]          (ya existe; la mantiene Claude Cowork)
        │  busca novedades, puntuaciones, portadas, enlaces
        │  genera un JSON con el esquema de la sección 5.1
        ▼
[Google Drive] carpeta "NOVEDADES_ROCK/"
        │  un fichero por día: 2026-09-06.json
        ▼
[Google Apps Script — web app, acceso anónimo, doGet]
        │  lee la carpeta, fusiona los JSON diarios,
        │  devuelve un único JSON ordenado por fecha (con caché)
        ▼
[Frontend PWA estático]  alojado en GitHub Pages (gratis)
        │  fetch() al endpoint de Apps Script
        │  guarda copia en localStorage / IndexedDB para uso offline
        ▼
[Iñigo, en el móvil]
```

Reparto de responsabilidades:

- **Claude Cowork** (no Claude Code): adaptar la tarea programada para que, además del aviso, escriba el JSON diario en Drive con el esquema exacto de 5.1. Claude Code **no** debe tocar la tarea programada; sí debe entregar el esquema JSON definitivo y un fichero de ejemplo para que se pueda ajustar la tarea.
- **Claude Code**: Apps Script (backend de lectura), frontend PWA, despliegue en GitHub Pages, datos de ejemplo para desarrollar sin depender del pipeline, documentación de puesta en marcha para Iñigo.

Ventajas: cero coste, sin claves API de pago, reutiliza herramientas que Iñigo ya conoce (Drive, Apps Script), y la parte "inteligente" (buscar, clasificar, resumir) ya la hace Claude cada mañana.

Riesgo a controlar: la calidad y consistencia del JSON generado por la tarea. Mitigación: esquema estricto, validación en Apps Script (descartar/avisar de entradas mal formadas), y campo `fuentes` obligatorio para poder comprobar cada dato.

### 4.2 Alternativa — "Opción A: pipeline propio con GitHub Actions"

Solo si la Opción B da problemas de calidad o si Iñigo prefiere independencia total de la tarea de Claude.

- GitHub Actions con cron diario ejecuta un script Node que consulta APIs públicas: **MusicBrainz** (lanzamientos por fecha y etiquetas de género) + **Cover Art Archive** (portadas, gratis, sin clave), **YouTube Data API v3** (vídeos y enlaces; requiere clave gratuita de Google Cloud), y feeds RSS de medios (Kerrang, Loudwire, Blabbermouth, Metal Injection, Metal Storm) para reseñas y puntuaciones.
- Clasificación de género, filtrado (nada de punk/pop) y resúmenes mediante la **API de Anthropic** (clave de pago; coste estimado de céntimos al día, a confirmar con Iñigo antes de activarlo).
- El script escribe `data/releases.json` en el propio repositorio; el frontend es el mismo que en la Opción B.

Desventajas: más cuentas y claves (Google Cloud, Anthropic), más piezas que pueden fallar, y las puntuaciones de crítica siguen siendo difíciles de obtener de forma fiable sin scraping frágil.

**Decisión: empezar por la Opción B.** Diseñar el frontend de modo que la fuente de datos sea intercambiable (una sola función `cargarLanzamientos()`), para poder migrar a la Opción A sin rehacer la interfaz.

### 4.3 Stack técnico

- Frontend: **Vite + React 18 + TypeScript + Tailwind CSS**. PWA con `vite-plugin-pwa` (manifest, service worker, instalable, funciona offline con los datos cacheados).
- Sin librería de componentes pesada; si hace falta, shadcn/ui.
- Backend de lectura: **Google Apps Script** (JavaScript), desplegado como web app con acceso "Cualquier usuario", solo `doGet`.
- Hosting: **GitHub Pages** desde la rama `main` mediante GitHub Actions (build de Vite y publicación automática en cada push).
- Sin base de datos. Sin servidor propio. Sin autenticación.

## 5. Modelo de datos

### 5.1 Esquema de un lanzamiento (JSON)

Un fichero diario `AAAA-MM-DD.json` contiene un array de objetos con esta forma. Todos los campos existen siempre; lo que no se conoce va como `null` (y la interfaz lo muestra como "N/D").

```json
{
  "id": "2026-09-04-beyond-the-black-break-the-silence",
  "fecha_lanzamiento": "2026-09-04",
  "fecha_deteccion": "2026-09-06",
  "artista": "Beyond the Black",
  "titulo": "Break the Silence",
  "anio": 2026,
  "genero": "heavy-metal",
  "subgenero": "symphonic-metal",
  "tipo_artista": "CLASICO",
  "pais": "Alemania",
  "sello": null,
  "es_reedicion": false,
  "portada_url": "https://…/portada.jpg",
  "resumen": "Una línea sobre por qué es relevante.",
  "tracklist_destacada": ["Tema 1", "Tema 2", "Tema 3"],
  "puntuaciones": [
    { "fuente": "Kerrang", "valor_original": "4/5", "sobre_10": 8.0, "url": "https://…" },
    { "fuente": "Metal Storm", "valor_original": "7.9/10", "sobre_10": 7.9, "url": "https://…" }
  ],
  "puntuacion_media": 7.95,
  "youtube_video_url": "https://www.youtube.com/watch?v=…",
  "youtube_music_url": "https://music.youtube.com/playlist?list=…",
  "fuentes": ["https://…", "https://…"]
}
```

Reglas:

- `id`: `fecha_lanzamiento` + slug de artista + slug de título. Sirve para deduplicar entre días (el mismo disco puede aparecer dos mañanas seguidas; se conserva la entrada más completa).
- `genero`: uno de los valores de la taxonomía (5.2). `subgenero`: texto libre en slug, opcional.
- `tipo_artista`: `"NUEVO"` o `"CLASICO"`.
- `puntuaciones[].sobre_10`: conversión a escala 1-10 según la tabla 5.3. `puntuacion_media`: media aritmética de `sobre_10` de las fuentes disponibles; `null` si no hay ninguna. **Nunca se inventa una puntuación.**
- `fuentes`: URLs de donde salió la información. Obligatorio, mínimo una.
- `portada_url`: preferir Cover Art Archive (`https://coverartarchive.org/release-group/<mbid>/front-500`) o la imagen de la ficha en Discogs/Last.fm. Si no hay, `null` y la interfaz muestra un placeholder con las iniciales del artista.

### 5.2 Taxonomía de géneros (valores permitidos en `genero`)

| Valor | Nombre en la interfaz | Incluye (subgéneros orientativos) |
|---|---|---|
| `heavy-metal` | Heavy Metal | metal clásico, power metal, NWOBHM, speed metal, doom tradicional, symphonic/melodic metal, thrash clásico (a confirmar, ver 12) |
| `hard-rock` | Hard Rock | hard rock clásico, blues rock duro, AOR / hard rock melódico |
| `glam` | Glam Rock / Glam Metal | glam rock, hair metal |
| `sleaze` | Sleaze Rock | sleaze, street rock |
| `rock-sureno` | Rock Sureño | southern rock en todas sus variantes: southern rock clásico, southern hard rock, country rock de sonido duro, southern metal |
| `gothic-metal` | Gothic Metal | gothic metal, gothic rock de sonido duro |
| `rock-and-roll` | Rock and Roll (duro) | rock and roll clásico de sonido duro, rock'n'roll de raíces con actitud hard rock |

Lista de exclusión (si Claude o el pipeline lo detectan, se descarta): punk, hardcore punk, pop punk, pop, pop rock blando, indie pop, música clásica, bandas sonoras orquestales, latino, reguetón, bachata, trap, hip hop, electrónica.

### 5.3 Conversión de puntuaciones a escala 1-10

| Fuente | Escala original | Conversión |
|---|---|---|
| Kerrang! | K's, 1-5 | × 2 |
| AllMusic | estrellas, 1-5 | × 2 |
| Metal Storm | 1-10 | directa |
| Pitchfork | 0-10 | directa |
| Loudwire, Metal Injection, Blabbermouth, Bravewords | varía (x/10, x/5, %) | normalizar a /10 |
| Sputnikmusic | 1-5 | × 2 |
| Blogs con porcentaje | 0-100 | ÷ 10 |
| Reseña sin nota numérica | — | no se convierte; solo se guarda la URL en `fuentes` |

## 6. Funcionalidades por fases

### 6.1 Fase 1 — MVP (lo mínimo útil, desplegado y visible en el móvil)

1. Repositorio en GitHub, proyecto Vite+React+TS+Tailwind, PWA instalable, desplegado en GitHub Pages.
2. Fichero `data/ejemplo-lanzamientos.json` con 10-15 entradas de ejemplo **claramente marcadas como ficticias** (artistas inventados o con nota "EJEMPLO") para poder desarrollar sin el pipeline real. No usar discos reales con datos inventados.
3. Pantalla **"Hoy"**: lista de tarjetas de las novedades del último día disponible, agrupadas por género.
4. Tarjeta de lanzamiento: portada (o placeholder), artista, título, año, etiqueta NUEVO/CLÁSICO, chip de género, puntuación media en un distintivo grande (o "N/D"), resumen de una línea, botones **"Ver en YouTube"** y **"Escuchar en YouTube Music"**.
5. Pantalla **detalle** (al tocar la tarjeta): todo lo anterior más tracklist destacada, tabla de puntuaciones por fuente con enlace a cada reseña, y lista de fuentes.
6. Pantalla **"Histórico"**: todos los lanzamientos, ordenados por fecha descendente, con filtros por género, tipo (NUEVO/CLÁSICO), puntuación mínima y búsqueda por texto (artista/título).
7. Función `cargarLanzamientos()` que lea del endpoint de Apps Script (URL configurable) y, si falla, de la última copia guardada en local; si no hay nada, del fichero de ejemplo.
8. Apps Script `doGet` que fusione los JSON diarios de la carpeta de Drive, deduplique por `id` y devuelva el array completo. Instrucciones paso a paso para que Iñigo lo despliegue (o, mejor, que Claude Code lo haga con `clasp` si Iñigo autoriza el acceso).
9. Documento `COMO-USAR.md` en castellano: cómo instalar la PWA en el móvil, cómo se actualiza, qué hacer si no carga.

### 6.2 Fase 2 — Comodidad

- Favoritos (marcar discos; se guardan en local).
- Marcar como "escuchado".
- Estadísticas sencillas: discos por mes, por género, mejor valorados del mes.
- Aviso dentro de la app cuando hay datos nuevos (comparar con la última visita).
- Compartir un lanzamiento (Web Share API) con portada y enlace de YouTube Music.

### 6.3 Fase 3 — Robustez

- Página de "calidad de datos": entradas sin portada, sin puntuación, sin enlace, para que Iñigo vea qué falta y Claude Cowork pueda ajustar la tarea.
- Copia de seguridad del histórico completo exportable (JSON) desde la app.
- Si procede, migración a la Opción A (pipeline propio).

### 6.4 Ideas para más adelante (no planificar ahora)

- Conciertos y festivales en España de los grupos que aparecen.
- Calendario de lanzamientos anunciados (próximas semanas).
- Notificación push desde la propia PWA.

## 7. Diseño de la interfaz

- **Móvil primero.** Una columna en móvil, rejilla de 2-3 columnas en PC.
- **Tema oscuro por defecto** (estética de app musical: fondo casi negro, texto claro, un color de acento cálido tipo ámbar `#E8A33D`), con opción de tema claro.
- Portadas cuadradas, grandes, con carga diferida (`loading="lazy"`).
- El distintivo de puntuación se colorea por tramos: ≥ 8 verde, 6-7.9 ámbar, < 6 gris. "N/D" en gris apagado.
- Navegación inferior fija en móvil: **Hoy · Histórico · Favoritos (F2) · Ajustes**.
- En Ajustes: URL del endpoint de datos, tema, borrar caché local, versión de la app.
- Texto en castellano, tamaño de letra generoso (Iñigo lo usará en el móvil a primera hora; nada de letra diminuta).
- Botones de YouTube / YouTube Music bien visibles y con icono; abren en la app nativa si está instalada (enlaces `https://music.youtube.com/...` y `https://www.youtube.com/watch?v=...`).
- Accesibilidad básica: contraste suficiente, botones de al menos 44 px, textos alternativos en portadas.

## 8. Pipeline diario (responsabilidad de Claude Cowork; aquí solo el contrato)

Cada día a las 7:00 (Madrid) la tarea programada:

1. Busca LPs lanzados en los últimos 1-2 días en los géneros de 5.2, descartando la lista de exclusión.
2. Para cada uno obtiene portada, puntuaciones (fuentes de 5.3), tracklist destacada, enlace a un vídeo/adelanto en YouTube y enlace al álbum en YouTube Music.
3. Genera `AAAA-MM-DD.json` con el esquema de 5.1 (array, puede estar vacío si no hay novedades: `[]`).
4. Lo guarda en la carpeta de Google Drive `NOVEDADES_ROCK/`.
5. Envía el aviso a Iñigo (esto ya funciona hoy).

Claude Code debe entregar, como parte de la Fase 1, el fichero `docs/esquema-lanzamiento.json` (JSON Schema) y `docs/ejemplo-dia.json` para que la tarea programada se ajuste a ellos exactamente.

## 9. Estructura del repositorio

```
novedades-rock/
├── PLAN.md                     ← este documento
├── COMO-USAR.md                ← guía para Iñigo (castellano, sin jerga)
├── README.md                   ← notas técnicas breves
├── docs/
│   ├── esquema-lanzamiento.json
│   └── ejemplo-dia.json
├── apps-script/
│   └── Code.gs                 ← doGet: fusiona JSON de Drive
├── data/
│   └── ejemplo-lanzamientos.json
├── public/                     ← iconos PWA, manifest
├── src/
│   ├── datos/                  ← cargarLanzamientos(), caché local, tipos
│   ├── componentes/            ← TarjetaLanzamiento, Distintivo, Filtros…
│   ├── paginas/                ← Hoy, Historico, Detalle, Ajustes
│   └── config/generos.ts       ← taxonomía 5.2 y lista de exclusión (único sitio)
├── .github/workflows/deploy.yml
└── package.json
```

Nombres de carpetas, componentes y variables **en castellano**, salvo convenciones del ecosistema (`src`, `public`, `package.json`).

## 10. Reglas de trabajo para Claude Code

- Antes de cada fase: modo plan, lista de tareas, preguntas a Iñigo si las hay.
- Después de cada bloque: `npm run build` sin errores, prueba en navegador (Playwright o captura), commit.
- Nada de datos reales inventados en los ejemplos. Los ejemplos se marcan como ficticios.
- Cualquier servicio nuevo, clave o coste: consultar primero.
- Explicar a Iñigo, cuando toque, qué tiene que hacer él, con capturas o pasos numerados.
- No tocar la tarea programada de Claude ni pedir a Iñigo que la cambie; eso se hace desde Claude Cowork con el esquema que entregue Claude Code.
- Mantener `src/config/generos.ts` como único lugar donde viven la taxonomía y la lista de exclusión.

## 11. Criterios de aceptación de la Fase 1

- [ ] La app se abre desde una URL pública de GitHub Pages y se puede instalar en el móvil de Iñigo como PWA.
- [ ] La pantalla "Hoy" muestra tarjetas con portada, artista, título, NUEVO/CLÁSICO, género, puntuación y los dos botones de YouTube.
- [ ] El detalle muestra tracklist, tabla de puntuaciones por fuente y fuentes.
- [ ] El histórico filtra por género, tipo, puntuación mínima y texto, y se abre sin conexión con los últimos datos cargados.
- [ ] Sin datos reales la app funciona con los ejemplos ficticios; con el endpoint configurado, carga los datos de Drive.
- [ ] El Apps Script devuelve el JSON fusionado y deduplicado, y rechaza entradas que no cumplan el esquema (las apunta en un campo `errores` de la respuesta).
- [ ] Existe `COMO-USAR.md` y Iñigo ha podido seguirlo sin ayuda.
- [ ] Ningún dato mostrado como cierto ha sido inventado: los huecos se ven como "N/D".

## 12. Decisiones pendientes (para Iñigo)

Claude Code debe preguntar estas cosas al principio si no están resueltas:

1. **Thrash metal**: ¿se incluye como variante del heavy metal o se excluye? Por defecto se incluye solo el thrash clásico de corte heavy.
2. **Metalcore / nu-metal / deathcore**: ¿se excluyen? Por defecto, excluidos.
3. **Cuenta de GitHub**: hace falta una (gratuita) para alojar la app. ¿Ya tiene Iñigo una o hay que crearla?
4. **Apps Script**: ¿lo despliega Iñigo siguiendo pasos o autoriza a Claude Code a hacerlo con `clasp` desde su cuenta de Google?
5. **Nombre de la app**: provisionalmente "Novedades Rock". Alternativas a valorar.
6. **Icono**: ¿alguna preferencia (color, símbolo)? Por defecto, un icono sencillo con el acento ámbar sobre fondo oscuro; sin usar logotipos ni imágenes de terceros.

Decisión ya resuelta por Iñigo: el género "rock sueño" del dictado original es **rock sureño** (southern rock), no rock sueco.

## 13. Prompt inicial para pegar en Claude Code

```
Lee el fichero PLAN.md de esta carpeta de principio a fin. Es la especificación
de una app web personal de novedades de rock/metal. Yo soy Iñigo, el usuario:
no soy programador, así que tú haces todo el trabajo técnico y me explicas en
castellano, paso a paso, lo que necesites que haga yo.

Antes de escribir código:
1. Entra en modo plan.
2. Hazme las preguntas de la sección 12 (decisiones pendientes) y cualquier
   otra duda que tengas.
3. Proponme el orden de trabajo de la Fase 1 y espera mi confirmación.

Después, ejecuta la Fase 1 siguiendo las reglas de la sección 10 y comprueba
los criterios de la sección 11 antes de darla por terminada.
```

---

## Anexo — Primeros pasos con Claude Code (para Iñigo, que aún no lo ha usado)

1. **Crea una carpeta vacía** en tu PC, por ejemplo `Documentos\novedades-rock`.
2. **Copia este documento dentro** con el nombre `PLAN.md`.
3. **Abre Claude Code.** Tienes dos vías:
   - Desde la aplicación de escritorio de Claude, en la sección "Code", eligiendo esa carpeta.
   - O desde un terminal (PowerShell) dentro de esa carpeta, escribiendo `claude` (si no está instalado, primero `npm install -g @anthropic-ai/claude-code`; hace falta tener Node.js instalado). La documentación oficial está en https://docs.claude.com/en/docs/claude-code.
4. **Pega el prompt de la sección 13** y envíalo.
5. Claude Code te irá pidiendo **permiso para ejecutar comandos** (instalar paquetes, crear ficheros, subir a GitHub). Es normal: léelos por encima y acepta. Si algo no lo entiendes, pregúntale antes de aceptar; responde en castellano sin problema.
6. Cuando te diga que la Fase 1 está lista, **abre la URL que te dé en el móvil**, instálala como app y compruébala con los criterios de la sección 11.
7. Vuelve a Claude Cowork (esta conversación) con el fichero `docs/esquema-lanzamiento.json` que te habrá generado: con él ajustaremos la tarea de las 7:00 para que empiece a guardar los datos reales en Drive.
