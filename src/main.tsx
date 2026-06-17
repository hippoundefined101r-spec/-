import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { initTelegram } from './telegram'
import './styles.css'

// Инициализируем Telegram Web App (вне Telegram — безопасный no-op).
initTelegram()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* HashRouter — чтобы маршруты работали без серверной настройки rewrite. */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
