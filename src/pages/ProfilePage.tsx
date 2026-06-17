import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { getTelegramUser } from '../telegram'

export function ProfilePage() {
  const navigate = useNavigate()
  const orders = useStore((s) => s.orders)
  const favorites = useStore((s) => s.favorites)
  const tgUser = getTelegramUser()

  const name = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
    : 'Гость'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="page">
      <h2 style={{ marginTop: 4 }}>Профиль</h2>
      <div className="profile-head">
        <div className="avatar">{initial}</div>
        <div>
          <div className="profile-name">{name}</div>
          {tgUser?.username && <div className="profile-username">@{tgUser.username}</div>}
          {!tgUser && <div className="profile-username">Откройте через Telegram</div>}
        </div>
      </div>

      <div className="menu">
        <button className="menu__item" onClick={() => navigate('/orders')}>
          📦 <span>Мои заказы</span>
          <span className="count">{orders.length}</span>
        </button>
        <button className="menu__item" onClick={() => navigate('/favorites')}>
          ❤️ <span>Избранное</span>
          <span className="count">{favorites.length}</span>
        </button>
        <button className="menu__item" onClick={() => navigate('/cart')}>
          🛒 <span>Корзина</span>
        </button>
      </div>

      <div className="section-title">Помощь</div>
      <div className="menu">
        <a className="menu__item" href="tel:88007703003">
          ☎️ <span>8 (800) 770-30-03</span>
          <span className="count">›</span>
        </a>
        <button className="menu__item">
          📍 <span>Адреса магазинов</span>
          <span className="count">›</span>
        </button>
        <button className="menu__item">
          🚚 <span>Условия доставки</span>
          <span className="count">›</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--tg-hint)', marginTop: 24, fontSize: 12 }}>
        КИРГУ · версия 0.1.0 (демо)
      </div>
    </div>
  )
}
