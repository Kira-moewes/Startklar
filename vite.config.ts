import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Die schwere 3D-Welt NICHT beim Installieren vorab laden – sie kommt
      // erst bei Bedarf über das Netz (datensparsam auf schwachen Anschlüssen).
      workbox: {
        globIgnores: ['**/FlugWelt3D-*.js'],
      },
      manifest: {
        name: 'Startklar',
        short_name: 'Startklar',
        description: 'Erwachsenwerden – aber machbar.',
        lang: 'de',
        theme_color: '#283618',
        background_color: '#FEFAE0',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
