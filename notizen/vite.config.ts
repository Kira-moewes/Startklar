import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative Asset-Pfade, damit die App an jedem Unterpfad lädt
  // (z.B. GitHub Pages unter /Startklar/) ohne Konfiguration.
  base: './',
  plugins: [react(), tailwindcss()],
})
