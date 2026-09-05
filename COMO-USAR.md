# CÓMO USAR "NOVEDADES ROCK" — guía para Iñigo

## Qué es

Tu app personal de novedades de rock y metal. Cada día, la tarea de Claude de las 7:00
guardará las novedades en tu Google Drive, y esta app te las enseña con portada, nota
de la crítica y botones para escucharlas en YouTube Music. También guarda todo el
histórico para que lo repases cuando quieras.

**La dirección de la app es:**

> **https://itrohintel-cmyk.github.io/novedades-rock/**

Guárdala en favoritos, aunque lo cómodo es instalarla (siguiente apartado).

---

## Instalarla en el móvil (Android)

1. Abre **Chrome** en el móvil y entra en la dirección de arriba.
2. Toca el menú de los **tres puntos** (⋮), arriba a la derecha.
3. Toca **«Añadir a la pantalla de inicio»** (en algunos móviles pone **«Instalar aplicación»**).
4. Confirma con **Instalar** (o **Añadir**).
5. Ya tienes el icono de la **púa ámbar** en tu pantalla de inicio. Se abre como una
   app normal, a pantalla completa, y funciona aunque no tengas cobertura (muestra
   lo último que cargó).

## Instalarla en el PC (opcional)

1. Abre la misma dirección en Chrome o Edge.
2. En la barra de la dirección, a la derecha, aparece un icono pequeño de **instalar**
   (un monitor con una flecha). Púlsalo y acepta.

---

## Cómo se usa

- **Hoy**: las novedades del último día, agrupadas por género. Toca cualquier tarjeta
  para ver la ficha completa (temas destacados, notas de cada revista, fuentes).
- **Histórico**: todos los discos desde que arrancó el sistema. Puedes filtrar por
  género, por NUEVO/CLÁSICO, por nota mínima, y buscar por nombre.
- **Ajustes**: cambiar entre tema oscuro y claro, y cosas técnicas que normalmente
  no tendrás que tocar.
- Los botones **«Ver en YouTube»** y **«Escuchar en YouTube Music»** abren la app
  correspondiente del móvil directamente.
- Cuando veas **«N/D»** significa «no disponible»: ese dato (nota, portada, enlace)
  no se ha encontrado de forma fiable. La app nunca se inventa datos.

## Cómo se actualiza

- **Los datos**: la app los pide al servidor cada vez que la abres. Si acabas de
  recibir el aviso de las 7:00 y no ves lo nuevo, cierra la app del todo y vuelve a abrirla.
- **La propia app**: se actualiza sola cuando publico mejoras. Como mucho, cierra y
  abre dos veces.

## Si algo no va

| Problema | Qué hacer |
|---|---|
| No carga nada y estás sin cobertura | Es normal si nunca llegó a cargar datos; con conexión, abre la app una vez y ya quedará copia para el futuro. |
| Sale el aviso «datos de EJEMPLO» | La app no llega al servidor. Comprueba la conexión. Si sigue, entra en Ajustes y mira que la dirección del servidor esté rellena. |
| Sale «mostrando la última copia guardada» | Sin conexión o el servidor no responde ahora mismo; estás viendo lo último descargado. Se arregla solo al volver la conexión. |
| Datos raros o antiguos | Ajustes → **Borrar copia local de datos**, y cierra y abre la app. |
| Nada de lo anterior funciona | Dímelo en Claude Code o en Cowork y lo miro. |

---

## De dónde salen los datos (por si un día falla algo)

1. **Tarea de Claude de las 7:00** (se gestiona desde Claude Cowork): busca las
   novedades y guarda un fichero `AAAA-MM-DD.json` en tu Drive, carpeta **NOVEDADES_ROCK**.
2. **Servidor de lectura** (Apps Script, en tu cuenta de Google): junta todos los
   ficheros diarios, quita duplicados, descarta entradas mal formadas y sirve el total.
3. **La app** lee ese servidor, guarda copia local y te lo enseña.

**Ahora mismo** la carpeta de Drive tiene **2 ficheros de prueba con discos ficticios**
(`2026-09-06.json` y `2026-09-07.json`). Cuando la tarea real empiece a guardar datos,
esos dos ficheros se pueden borrar de la carpeta (o me lo pides y lo hago yo).

## El paso que queda (para Claude Cowork)

Lleva a tu conversación de Claude Cowork estos dos ficheros de la carpeta del proyecto
(`Documentos\Novedades Rock\docs\`):

- **esquema-lanzamiento.json** — el formato exacto que debe cumplir cada disco.
- **ejemplo-dia.json** — un día de ejemplo válido.

Y dile: «ajusta la tarea de las 7:00 para que, además del aviso, guarde cada día un
fichero `AAAA-MM-DD.json` con este esquema en la carpeta NOVEDADES_ROCK de mi Drive».
En cuanto la tarea guarde el primer fichero real, la app lo mostrará sola.
