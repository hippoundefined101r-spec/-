import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Абсолютный base под GitHub Pages этого репозитория (имя репо — "-").
  // Важно: НЕ относительный './', иначе при открытии адреса без завершающего
  // слэша (частый случай на телефоне) ассеты резолвятся не туда → белый экран.
  base: '/-/',
  server: {
    host: true,
    port: 5173,
  },
})
