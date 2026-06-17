import { stocks } from '../data/stocks'
import { haptic } from '../telegram'

export function StocksPage() {
  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">КИРГУ</div>
        <div className="app-header__sub">Акции и скидки</div>
      </header>
      <div className="page">
        <div className="stocks-list">
          {stocks.map((s) => (
            <button
              key={s.id}
              className="stock-banner"
              style={{ background: s.accent ?? 'var(--brand)' }}
              onClick={() => haptic('light')}
            >
              <div className="stock-banner__title">{s.title}</div>
              {s.subtitle && <div className="stock-banner__sub">{s.subtitle}</div>}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
