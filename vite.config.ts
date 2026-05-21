import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Allows Firebase Auth popups to communicate back without COOP blocking window.closed
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      "/api": {
        target: "http://localhost:4321",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
})
