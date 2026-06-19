import { brands } from '../data/products'

export interface Filters {
  brands: string[]
  storages: string[]
  colors: string[]
  priceMin: string
  priceMax: string
  inStockOnly: boolean
}

export const emptyFilters: Filters = {
  brands: [],
  storages: [],
  colors: [],
  priceMin: '',
  priceMax: '',
  inStockOnly: false,
}

const STORAGES = ['128 ГБ', '256 ГБ', '512 ГБ', '1 ТБ']
const COLORS = ['Чёрный', 'Синий', 'Титан', 'Розовый', 'Голубой']

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
}

export function FilterPanel({ filters, onChange }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  return (
    <div>
      <div className="filter-block">
        <div className="filter-block__title">Цена, ₽</div>
        <div className="range-row">
          <input
            inputMode="numeric"
            placeholder="от"
            value={filters.priceMin}
            onChange={(e) => set({ priceMin: e.target.value.replace(/\D/g, '') })}
          />
          <input
            inputMode="numeric"
            placeholder="до"
            value={filters.priceMax}
            onChange={(e) => set({ priceMax: e.target.value.replace(/\D/g, '') })}
          />
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-block__title">Бренд</div>
        {brands.map((b) => (
          <label className="check" key={b}>
            <input
              type="checkbox"
              checked={filters.brands.includes(b)}
              onChange={() => set({ brands: toggle(filters.brands, b) })}
            />
            {b}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-block__title">Память</div>
        {STORAGES.map((s) => (
          <label className="check" key={s}>
            <input
              type="checkbox"
              checked={filters.storages.includes(s)}
              onChange={() => set({ storages: toggle(filters.storages, s) })}
            />
            {s}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-block__title">Цвет</div>
        {COLORS.map((c) => (
          <label className="check" key={c}>
            <input
              type="checkbox"
              checked={filters.colors.includes(c)}
              onChange={() => set({ colors: toggle(filters.colors, c) })}
            />
            {c}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <label className="check">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => set({ inStockOnly: e.target.checked })}
          />
          Только в наличии
        </label>
      </div>

      <button className="btn btn--ghost btn--block" onClick={() => onChange(emptyFilters)}>
        Сбросить фильтры
      </button>
    </div>
  )
}
