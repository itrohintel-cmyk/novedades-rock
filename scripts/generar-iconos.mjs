/* Genera los PNG del icono PWA a partir de public/icono.svg.
   Uso: npm run iconos  (solo hace falta si cambia el icono). */
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const svg = readFileSync(new URL('../public/icono.svg', import.meta.url))

/* Versión "maskable": Android recorta el icono en círculo, así que la púa
   se encoge para quedar dentro de la zona segura (80% central). */
const svgMaskable = readFileSync(new URL('../public/icono.svg', import.meta.url), 'utf8')
  .replace('<path\n    d="M256 452', '<g transform="translate(256 256) scale(0.72) translate(-256 -256)"><path\n    d="M256 452')
  .replace('opacity="0.35"\n  />', 'opacity="0.35"\n  /></g>')
  .replace('rx="96"', 'rx="0"')

const salidas = [
  { fichero: 'public/pwa-192.png', tamano: 192, fuente: svg },
  { fichero: 'public/pwa-512.png', tamano: 512, fuente: svg },
  { fichero: 'public/pwa-maskable-512.png', tamano: 512, fuente: Buffer.from(svgMaskable) },
  { fichero: 'public/apple-touch-icon.png', tamano: 180, fuente: svg },
]

for (const { fichero, tamano, fuente } of salidas) {
  await sharp(fuente, { density: 300 }).resize(tamano, tamano).png().toFile(fichero)
  console.log(`✓ ${fichero} (${tamano}x${tamano})`)
}
