import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps the build portable: it works from any sub-path or straight from a static host.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
})
