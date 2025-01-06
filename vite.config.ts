import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
<<<<<<< Updated upstream
    port: 3000,
=======
    host: true,
    port: 5173,
>>>>>>> Stashed changes
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
