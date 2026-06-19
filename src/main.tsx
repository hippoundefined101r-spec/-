import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* HashRouter — маршруты работают без серверной настройки rewrite (удобно для статик-превью). */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
