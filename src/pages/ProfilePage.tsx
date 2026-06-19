import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { BRAND_NAME, PHONE, PHONE_HREF, WHATSAPP } from '../config'

export function ProfilePage() {
  const navigate = useNavigate()
  const orders = useStore((s) => s.orders)
  const favorites = useStore((s) => s.favorites)

  return (
    <>
      <h1 className="page-title">Профиль</h1>

      <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="logo__mark" style={{ width: 48, height: 48, fontSize: 22 }}>
          👤
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Гость</div>
          <div className="muted" style={{ fontSize: 13 }}>Войдите, чтобы сохранять заказы</div>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 16 }}>
        <button className="panel" style={menuStyle} onClick={() => navigate('/orders')}>
          <span>📦 Мои заказы</span>
          <span className="tag">{orders.length}</span>
        </button>
        <button className="panel" style={menuStyle} onClick={() => navigate('/favorites')}>
          <span>❤️ Избранное</span>
          <span className="tag">{favorites.length}</span>
        </button>
        <button className="panel" style={menuStyle} onClick={() => navigate('/trade-in')}>
          <span>🔄 Трейд-ин</span>
          <span className="muted">›</span>
        </button>
        <button className="panel" style={menuStyle} onClick={() => navigate('/about')}>
          <span>🛡️ Гарантия и сервис</span>
          <span className="muted">›</span>
        </button>
      </div>

      <div className="section-head" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16 }}>Помощь</h2>
      </div>
      <div className="stack">
        <a className="panel" style={menuStyle} href={PHONE_HREF}>
          <span>☎️ {PHONE}</span>
          <span className="muted">›</span>
        </a>
        <a className="panel" style={menuStyle} href={WHATSAPP} target="_blank" rel="noreferrer">
          <span>💬 Написать в WhatsApp</span>
          <span className="muted">›</span>
        </a>
      </div>

      <p className="muted" style={{ textAlign: 'center', marginTop: 24, fontSize: 12 }}>
        {BRAND_NAME} · демо-макет v0.1.0
      </p>
    </>
  )
}

const menuStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
  fontSize: 15,
  fontWeight: 600,
}
