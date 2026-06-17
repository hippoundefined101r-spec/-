import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, products } from '../data/products'
import { useStore } from '../store/useStore'
import { formatPrice, cashback } from '../utils/format'
import { haptic } from '../telegram'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'
import { ProductCard } from '../components/ProductCard'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id ? getProduct(id) : undefined

  const cart = useStore((s) => s.cart)
  const addToCart = useStore((s) => s.addToCart)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)

  if (!product) {
    return (
      <div className="page">
        <BackLink />
        <EmptyState icon="📦" title="Товар не найден" actionLabel="В каталог" actionTo="/" />
      </div>
    )
  }

  const inCart = cart.some((i) => i.productId === product.id)
  const isFav = favorites.includes(product.id)
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <div className="page">
        <BackLink />
        <img
          className="product__img"
          src={product.image}
          alt={product.title}
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
        />
        <h1 className="product__title">{product.title}</h1>
        <div className="card__rating" style={{ fontSize: 14 }}>
          ⭐ {product.rating} · {product.reviews} отзывов · {product.brand}
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="product__price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="card__oldprice" style={{ fontSize: 16 }}>
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: product.inStock ? 'var(--success)' : 'var(--danger)' }}>
            {product.inStock ? '✓ В наличии' : '✕ Нет в наличии'}
          </span>
          {product.inStock && (
            <span className="cashback">
              💰 кэшбэк {cashback(product.price).toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        <p style={{ color: 'var(--tg-text)', marginTop: 14 }}>{product.description}</p>

        <div className="section-title">Характеристики</div>
        <div className="specs">
          {product.specs.map((s) => (
            <div className="specs__row" key={s.label}>
              <span className="specs__label">{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <>
            <div className="section-title">Похожие товары</div>
            <div className="grid" style={{ marginTop: 0 }}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="summary">
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn-secondary"
            style={{ flex: '0 0 56px' }}
            onClick={() => {
              haptic('light')
              toggleFavorite(product.id)
            }}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button
            className="btn-primary"
            disabled={!product.inStock}
            onClick={() => {
              haptic('medium')
              if (inCart) navigate('/cart')
              else addToCart(product.id)
            }}
          >
            {!product.inStock
              ? 'Нет в наличии'
              : inCart
                ? 'Перейти в корзину'
                : `В корзину · ${formatPrice(product.price)}`}
          </button>
        </div>
      </div>
    </>
  )
}
