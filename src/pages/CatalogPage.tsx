import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'
import { FilterPanel, emptyFilters, type Filters } from '../components/FilterPanel'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const activeCat = params.get('cat')

  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState(query)

  const setCat = (cat: string | null) => {
    const next = new URLSearchParams(params)
    if (cat) next.set('cat', cat)
    else next.delete('cat')
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const min = filters.priceMin ? Number(filters.priceMin) : 0
    const max = filters.priceMax ? Number(filters.priceMax) : Infinity

    return products.filter((p) => {
      if (activeCat && p.categoryId !== activeCat) return false
      if (q && !p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      if (p.price < min || p.price > max) return false
      if (filters.inStockOnly && !p.inStock) return false
      if (filters.storages.length) {
        const labels = (p.storages ?? []).map((s) => s.label)
        if (!filters.storages.some((s) => labels.includes(s))) return false
      }
      if (filters.colors.length) {
        const names = (p.colors ?? []).map((c) => c.name)
        if (!filters.colors.some((c) => names.includes(c))) return false
      }
      return true
    })
  }, [search, activeCat, filters])

  const activeCount =
    filters.brands.length +
    filters.storages.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0)

  return (
    <>
      <h1 className="page-title">
        {activeCat ? categories.find((c) => c.id === activeCat)?.title : 'Каталог'}
      </h1>

      <div className="search" style={{ marginBottom: 14 }}>
        <span>🔍</span>
        <input
          placeholder="Поиск товаров и брендов"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <span onClick={() => setSearch('')}>✕</span>}
      </div>

      <div className="chips">
        <button className={`chip ${!activeCat ? 'active' : ''}`} onClick={() => setCat(null)}>
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`chip ${activeCat === c.id ? 'active' : ''}`}
            onClick={() => setCat(activeCat === c.id ? null : c.id)}
          >
            <span>{c.icon}</span>
            {c.title}
          </button>
        ))}
      </div>

      <div className="catalog-layout">
        <aside className="filters-aside">
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        <div>
          <p className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
            Найдено товаров: {filtered.length}
          </p>
          {filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Ничего не найдено"
              text="Попробуйте изменить запрос или сбросить фильтры"
            />
          ) : (
            <div className="grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Мобильная кнопка фильтров */}
      <button className="filter-fab" onClick={() => setSheetOpen(true)}>
        ⚙️ Фильтры{activeCount > 0 ? ` · ${activeCount}` : ''}
      </button>

      {/* Шторка фильтров */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="sheet-overlay"
            onClick={() => setSheetOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="sheet__handle" />
              <div className="sheet__title">Фильтры</div>
              <FilterPanel filters={filters} onChange={setFilters} />
              <button
                className="btn btn--primary btn--block"
                style={{ marginTop: 14 }}
                onClick={() => setSheetOpen(false)}
              >
                Показать {filtered.length} товаров
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
