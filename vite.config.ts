import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Базовый путь '' удобен для деплоя Mini App на любой хостинг/поддиректорию
  base: './',
  server: {
    host: true,
    port: 5173,
  },
})
