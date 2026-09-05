# Novedades Rock

App web personal (PWA) de novedades discográficas de rock y metal. Especificación
completa en [PLAN.md](PLAN.md); guía de usuario en [COMO-USAR.md](COMO-USAR.md).

- **Producción:** https://itrohintel-cmyk.github.io/novedades-rock/
- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS 4 + vite-plugin-pwa.
- **Datos:** ficheros diarios `AAAA-MM-DD.json` en Drive (`NOVEDADES_ROCK/`) →
  Apps Script `doGet` (fusión + validación + dedupe, [apps-script/Code.gs](apps-script/Code.gs)) →
  `cargarLanzamientos()` con fallback a copia local (localStorage) y a
  [data/ejemplo-lanzamientos.json](data/ejemplo-lanzamientos.json) (datos ficticios).
- **Contrato del pipeline:** [docs/esquema-lanzamiento.json](docs/esquema-lanzamiento.json)
  (+ [docs/ejemplo-dia.json](docs/ejemplo-dia.json)). La tarea diaria la mantiene
  Claude Cowork; desde este repo no se toca.
- **Taxonomía de géneros y exclusiones:** único sitio, [src/config/generos.ts](src/config/generos.ts).

## Comandos

```bash
npm install        # dependencias
npm run dev        # desarrollo (http://localhost:5173/novedades-rock/)
npm run build      # tsc + build de producción en dist/
npm run iconos     # regenerar PNG del icono desde public/icono.svg
```

## Despliegues

- **Frontend:** push a `main` → GitHub Actions compila y publica en Pages
  ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).
- **Backend:** `cd apps-script && npx clasp push -f && npx clasp deploy`
  (requiere `clasp login` con la cuenta de Google del propietario). El endpoint
  desplegado está grabado como valor por defecto en
  [src/datos/cargarLanzamientos.ts](src/datos/cargarLanzamientos.ts) y puede
  sobrescribirse en la pantalla de Ajustes de la app.
