import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { initTelegram } from './telegram'
import './styles.css'

// Инициализируем Telegram Web App (вне Telegram — безопасный no-op).
initTelegram()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*
      MemoryRouter, а не HashRouter: Telegram открывает Mini App с хвостом
      #tgWebAppData=... в адресе. HashRouter принял бы его за маршрут и показал
      пустой экран. Навигация в приложении — программная (navigate), URL не нужен.
    */}
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>,
)
