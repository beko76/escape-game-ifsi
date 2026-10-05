import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base relative : l'app fonctionne quel que soit le sous-dossier d'hébergement
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 800 },
  plugins: [react(), tailwindcss()],
})
