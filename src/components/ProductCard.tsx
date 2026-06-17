import { useNavigate } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import type { Product } from '../types'
import { useStore } from '../store/useStore'
import { formatPrice, cashback } from '../utils/format'
import { haptic } from '../telegram'

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const addToCart = useStore((s) => s.addToCart)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const favorites = useStore((s) => s.favorites)

  const inCart = cart.some((i) => i.productId === product.id)
  const isFav = favorites.includes(product.id)
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div className="card">
      <div onClick={() => navigate(`/product/${product.id}`)}>
        {discount > 0 && product.inStock && <div className="badge">−{discount}%</div>}
        {!product.inStock && <div className="badge badge--out">Нет в наличии</div>}
        <img
          className="card__img"
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
        />
      </div>
      <button
        className="card__fav"
        onClick={() => {
          haptic('light')
          toggleFavorite(product.id)
        }}
        aria-label="В избранное"
      >
        <Heart size={18} strokeWidth={2} fill={isFav ? '#e3262c' : 'none'} color={isFav ? '#e3262c' : '#8a8f98'} />
      </button>
      <div className="card__body">
        <div className="card__title" onClick={() => navigate(`/product/${product.id}`)}>
          {product.title}
        </div>
        <div className="card__rating">
          <Star size={13} fill="#f5a623" color="#f5a623" />
          {product.rating} · {product.reviews} отз.
        </div>
        <div className="card__price">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="card__oldprice">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        {product.inStock && (
          <span className="cashback">+{cashback(product.price).toLocaleString('ru-RU')} ₽ бонусами</span>
        )}
        <button
          className={`card__btn ${inCart ? 'card__btn--incart' : ''}`}
          disabled={!product.inStock}
          onClick={() => {
            haptic('medium')
            if (inCart) {
              navigate('/cart')
            } else {
              addToCart(product.id)
            }
          }}
        >
          {!product.inStock ? 'Нет в наличии' : inCart ? 'В корзине ✓' : 'В корзину'}
        </button>
      </div>
    </div>
  )
}
