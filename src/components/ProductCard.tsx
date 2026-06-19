import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../types'
import { useStore } from '../store/useStore'
import { formatPrice, installmentLabel } from '../utils/format'

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

  const open = () => navigate(`/product/${product.id}`)

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
    >
      <div className="card__media" onClick={open}>
        <div className="card__badges">
          {discount > 0 && product.inStock && <span className="badge">−{discount}%</span>}
          {product.isHit && <span className="badge badge--hit">ХИТ</span>}
          {product.isNew && <span className="badge badge--new">NEW</span>}
          {!product.inStock && <span className="badge badge--out">Нет в наличии</span>}
        </div>
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
        onClick={() => toggleFavorite(product.id)}
        aria-label="В избранное"
      >
        {isFav ? '❤️' : '🤍'}
      </button>
      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <div className="card__title" onClick={open}>
          {product.title}
        </div>
        <div className="card__rating">
          ⭐ {product.rating} · {product.reviews} отз.
        </div>
        <div className="card__price">
          {formatPrice(product.price)}
          {product.oldPrice && <span className="card__oldprice">{formatPrice(product.oldPrice)}</span>}
        </div>
        <span className="installment">💳 {installmentLabel(product.price)}</span>
        <button
          className={`btn ${inCart ? 'btn--ghost' : 'btn--primary'} btn--block card__btn`}
          disabled={!product.inStock}
          onClick={() => {
            if (inCart) navigate('/cart')
            else addToCart(product.id)
          }}
        >
          {!product.inStock ? 'Нет в наличии' : inCart ? 'В корзине ✓' : 'В корзину'}
        </button>
      </div>
    </motion.div>
  )
}
