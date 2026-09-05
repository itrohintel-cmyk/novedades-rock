import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // La app se sirve en https://<usuario>.github.io/novedades-rock/
  base: '/novedades-rock/',
  plugins: [react(), tailwindcss()],
})
