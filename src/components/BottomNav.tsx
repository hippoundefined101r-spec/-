import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Tag, ShoppingCart, User, type LucideIcon } from 'lucide-react'
import { useCartCount } from '../store/useStore'
import { haptic } from '../telegram'

const items: { to: string; icon: LucideIcon; label: string; end: boolean }[] = [
  { to: '/', icon: Home, label: 'Каталог', end: true },
  { to: '/rooms', icon: LayoutGrid, label: 'Комнаты', end: false },
  { to: '/stocks', icon: Tag, label: 'Акции', end: false },
  { to: '/cart', icon: ShoppingCart, label: 'Корзина', end: false },
  { to: '/profile', icon: User, label: 'Профиль', end: false },
]

export function BottomNav() {
  const cartCount = useCartCount()

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Ic = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => haptic('light')}
            className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav__icon">
              <Ic size={22} strokeWidth={2} />
              {item.to === '/cart' && cartCount > 0 && (
                <span className="bottom-nav__badge">{cartCount}</span>
              )}
            </span>
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
