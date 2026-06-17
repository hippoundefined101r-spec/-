import { NavLink } from 'react-router-dom'
import { useCartCount } from '../store/useStore'
import { haptic } from '../telegram'

const items = [
  { to: '/', icon: '🏠', label: 'Каталог', end: true },
  { to: '/rooms', icon: '🚪', label: 'Комнаты', end: false },
  { to: '/stocks', icon: '🏷️', label: 'Акции', end: false },
  { to: '/cart', icon: '🛒', label: 'Корзина', end: false },
  { to: '/profile', icon: '👤', label: 'Профиль', end: false },
]

export function BottomNav() {
  const cartCount = useCartCount()

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => haptic('light')}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          {item.to === '/cart' && cartCount > 0 && (
            <span className="bottom-nav__badge">{cartCount}</span>
          )}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
