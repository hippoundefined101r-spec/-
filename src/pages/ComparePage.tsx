import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/format'

const phones = products.filter((p) => p.categoryId === 'iphone' || p.categoryId === 'android')

export function ComparePage() {
  const [selected, setSelected] = useState<string[]>([
    'iphone-15-pro-max',
    'samsung-s24-ultra',
  ])

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s,
    )

  const items = selected.map((id) => phones.find((p) => p.id === id)!).filter(Boolean)
  const specLabels = Array.from(
    new Set(items.flatMap((p) => p.specs.map((s) => s.label))),
  )

  return (
    <>
      <h1 className="page-title">Сравнение моделей</h1>
      <p className="lead" style={{ marginBottom: 16 }}>
        Выберите до 3 смартфонов, чтобы сравнить характеристики и цены.
      </p>

      <div className="chips" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
        {phones.map((p) => (
          <button
            key={p.id}
            className={`chip ${selected.includes(p.id) ? 'active' : ''}`}
            onClick={() => toggle(p.id)}
          >
            {p.title}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="muted" style={{ marginTop: 20 }}>Выберите хотя бы один товар выше.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <div
            className="specs"
            style={{
              display: 'grid',
              gridTemplateColumns: `140px repeat(${items.length}, minmax(150px, 1fr))`,
              minWidth: 'fit-content',
            }}
          >
            {/* Шапка */}
            <div className="specs__row specs__label" style={{ fontWeight: 700 }}>
              Модель
            </div>
            {items.map((p) => (
              <div className="specs__row" key={p.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }}
                />
                <Link to={`/product/${p.id}`} style={{ fontWeight: 700, fontSize: 13 }}>
                  {p.title}
                </Link>
              </div>
            ))}

            {/* Цена */}
            <div className="specs__row specs__label">Цена</div>
            {items.map((p) => (
              <div className="specs__row" key={p.id} style={{ fontWeight: 800 }}>
                {formatPrice(p.price)}
              </div>
            ))}

            {/* Рейтинг */}
            <div className="specs__row specs__label">Рейтинг</div>
            {items.map((p) => (
              <div className="specs__row" key={p.id}>
                ⭐ {p.rating}
              </div>
            ))}

            {/* Характеристики */}
            {specLabels.map((label) => (
              <Row key={label} label={label} items={items} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function Row({ label, items }: { label: string; items: typeof products }) {
  return (
    <>
      <div className="specs__row specs__label">{label}</div>
      {items.map((p) => (
        <div className="specs__row" key={p.id}>
          {p.specs.find((s) => s.label === label)?.value ?? '—'}
        </div>
      ))}
    </>
  )
}
