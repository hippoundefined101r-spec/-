import { useStore } from '../store/useStore'
import { getProduct } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'

export function FavoritesPage() {
  const favorites = useStore((s) => s.favorites)
  const items = favorites.map(getProduct).filter(Boolean)

  return (
    <div className="page">
      <h2 style={{ marginTop: 4 }}>Избранное</h2>
      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="В избранном пусто"
          text="Нажмите на сердечко у товара, чтобы сохранить его"
          actionLabel="В каталог"
          actionTo="/"
        />
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p!.id} product={p!} />
          ))}
        </div>
      )}
    </div>
  )
}
