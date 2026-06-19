import { NavLink } from 'react-router-dom'
import { useCartCount, useStore } from '../store/useStore'

const TABS = [
  { to: '/', icon: '🏠', label: 'Главная', end: true },
  { to: '/catalog', icon: '🗂️', label: 'Каталог', end: false },
  { to: '/favorites', icon: '❤️', label: 'Избранное', end: false },
  { to: '/cart', icon: '🛒', label: 'Корзина', end: false },
  { to: '/profile', icon: '👤', label: 'Профиль', end: false },
]

export function MobileTabBar() {
  const cartCount = useCartCount()
  const favCount = useStore((s) => s.favorites.length)

  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          <span className="tab__icon">{t.icon}</span>
          {t.label}
          {t.to === '/cart' && cartCount > 0 && <span className="tab__badge">{cartCount}</span>}
          {t.to === '/favorites' && favCount > 0 && <span className="tab__badge">{favCount}</span>}
        </NavLink>
      ))}
    </nav>
  )
}
