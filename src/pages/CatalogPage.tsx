import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { rooms } from '../data/rooms'
import { stocks } from '../data/stocks'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'
import { haptic } from '../telegram'
import { categoryIcon, roomIcon } from '../icons'
import { Search, X } from 'lucide-react'
import { Logo } from '../components/Logo'

type Sort = 'popular' | 'price_asc' | 'price_desc' | 'discount'

export function CatalogPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('popular')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter((p) => {
      const matchCat = !activeCat || p.categoryId === activeCat
      const matchQuery =
        !q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
    const discount = (p: (typeof products)[number]) =>
      p.oldPrice ? 1 - p.price / p.oldPrice : 0
    const sorted = [...list]
    if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'discount') sorted.sort((a, b) => discount(b) - discount(a))
    else sorted.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    return sorted
  }, [query, activeCat, sort])

  const searching = query.trim().length > 0

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <Logo size={32} />
        </div>
        <div className="app-header__sub">Мебель, техника и товары для дома</div>
        <div className="search">
          <Search size={18} color="#8a8f98" />
          <input
            placeholder="Поиск товаров и брендов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <X size={18} color="#8a8f98" onClick={() => setQuery('')} />}
        </div>
        <div className="chips">
          <button
            className={`chip ${!activeCat ? 'active' : ''}`}
            onClick={() => setActiveCat(null)}
          >
            Все
          </button>
          {categories.map((c) => {
            const Ic = categoryIcon[c.id]
            return (
              <button
                key={c.id}
                className={`chip ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
              >
                {Ic && <Ic size={15} strokeWidth={2} />}
                {c.title}
              </button>
            )
          })}
        </div>
      </header>

      <div className="page">
        {!searching && (
          <>
            {/* Акции */}
            <div className="strip">
              {stocks.map((s) => (
                <button
                  key={s.id}
                  className="stock-chip"
                  style={{ background: s.accent ?? 'var(--brand)' }}
                  onClick={() => {
                    haptic('light')
                    navigate('/stocks')
                  }}
                >
                  <span className="stock-chip__title">{s.title}</span>
                  {s.subtitle && <span className="stock-chip__sub">{s.subtitle}</span>}
                </button>
              ))}
            </div>

            {/* Покупки по комнатам */}
            <div className="section-row">
              <div className="section-title">Покупки по комнатам</div>
              <button className="link-more" onClick={() => navigate('/rooms')}>
                Все ›
              </button>
            </div>
            <div className="strip">
              {rooms.map((r) => {
                const Ic = roomIcon[r.id]
                return (
                  <button
                    key={r.id}
                    className="room-chip"
                    onClick={() => {
                      haptic('light')
                      navigate(`/room/${r.id}`)
                    }}
                  >
                    <span className="room-chip__icon">
                      {Ic && <Ic size={24} strokeWidth={1.8} color="#0aa64b" />}
                    </span>
                    <span>{r.title}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        <div className="section-row">
          <div className="section-title">{searching ? 'Результаты поиска' : 'Каталог'}</div>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="popular">Популярные</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="discount">По скидке</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="Ничего не найдено" text="Попробуйте изменить запрос" />
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
