import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // En desarrollo, /api y /uploads se reenvían al backend: el navegador ve un solo origen,
  // igual que en el servidor (nginx), y la cookie de sesión funciona sin configurar CORS.
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})