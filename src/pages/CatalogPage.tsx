import { useMemo, useState } from 'react'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchCat = !activeCat || p.categoryId === activeCat
      const matchQuery =
        !q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, activeCat])

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span>ТЕХНО</span>
          <span className="accent">КЫРГЫЗ</span>
        </div>
        <div className="app-header__sub">Электроника и бытовая техника №1 в Кыргызстане</div>
        <div className="search">
          <span>🔍</span>
          <input
            placeholder="Поиск товаров и брендов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <span onClick={() => setQuery('')}>✕</span>}
        </div>
        <div className="chips">
          <button
            className={`chip ${!activeCat ? 'active' : ''}`}
            onClick={() => setActiveCat(null)}
          >
            Все
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
            >
              <span>{c.icon}</span>
              {c.title}
            </button>
          ))}
        </div>
      </header>

      <div className="page">
        {filtered.length === 0 ? (
          <EmptyState icon="🔍" title="Ничего не найдено" text="Попробуйте изменить запрос" />
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
