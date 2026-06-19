import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CITY, CITIES, PHONE, PHONE_HREF } from '../config'
import { useCartCount } from '../store/useStore'
import { Logo } from './Logo'

const NAV = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/trade-in', label: 'Трейд-ин' },
  { to: '/promo', label: 'Акции' },
  { to: '/blog', label: 'Блог' },
  { to: '/about', label: 'О нас' },
]

export function Header() {
  const navigate = useNavigate()
  const cartCount = useCartCount()
  const [city, setCity] = useState(CITY)
  const [query, setQuery] = useState('')

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/catalog${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header__bar">
          <NavLink to="/" aria-label="На главную">
            <Logo />
          </NavLink>

          <label className="header__city">
            📍
            <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Город">
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <nav className="header__nav">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__spacer" />

          <a className="header__phone" href={PHONE_HREF}>
            {PHONE}
          </a>

          <div className="header__actions">
            <button className="icon-btn" onClick={() => navigate('/favorites')} aria-label="Избранное">
              ❤️
            </button>
            <button className="icon-btn" onClick={() => navigate('/cart')} aria-label="Корзина">
              🛒
              {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <form className="header__search" onSubmit={submitSearch}>
          <div className="search">
            <span>🔍</span>
            <input
              placeholder="Поиск: iPhone, наушники, бренд…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && <span onClick={() => setQuery('')}>✕</span>}
          </div>
        </form>
      </div>
    </header>
  )
}
