import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProduct, products } from '../data/products'
import { useStore } from '../store/useStore'
import { formatPrice, cashback, installmentLabel } from '../utils/format'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'
import { ProductCard } from '../components/ProductCard'
import { OneClickModal } from '../components/OneClickModal'
import { reviews } from '../data/promos'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = id ? getProduct(id) : undefined

  const cart = useStore((s) => s.cart)
  const addToCart = useStore((s) => s.addToCart)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)

  const [photo, setPhoto] = useState(0)
  const [colorIdx, setColorIdx] = useState(0)
  const [storageIdx, setStorageIdx] = useState(
    product?.storages ? product.storages.findIndex((s) => s.priceDelta === 0) : 0,
  )
  const [oneClick, setOneClick] = useState(false)

  if (!product) {
    return (
      <div>
        <BackLink />
        <EmptyState icon="📦" title="Товар не найден" actionLabel="В каталог" actionTo="/catalog" />
      </div>
    )
  }

  const gallery = product.gallery ?? [product.image]
  const colorDelta = product.colors?.[colorIdx]?.priceDelta ?? 0
  const storageDelta = product.storages?.[storageIdx >= 0 ? storageIdx : 0]?.priceDelta ?? 0
  const price = product.price + colorDelta + storageDelta

  const inCart = cart.some((i) => i.productId === product.id)
  const isFav = favorites.includes(product.id)
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <BackLink />

      <div className="pdp">
        {/* Галерея */}
        <div>
          <motion.div
            className="gallery__main"
            key={photo}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <img
              src={gallery[photo]}
              alt={product.title}
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            />
          </motion.div>
          <div className="gallery__thumbs">
            {gallery.map((g, idx) => (
              <button
                key={idx}
                className={`gallery__thumb ${idx === photo ? 'active' : ''}`}
                onClick={() => setPhoto(idx)}
              >
                <img src={g} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Информация */}
        <div>
          <span className="card__brand">{product.brand}</span>
          <h1 className="pdp__title">{product.title}</h1>
          <div className="card__rating" style={{ margin: '6px 0' }}>
            ⭐ {product.rating} · {product.reviews} отзывов
          </div>

          <div className="pdp__price">{formatPrice(price)}</div>
          {product.oldPrice && (
            <span className="card__oldprice" style={{ fontSize: 15 }}>
              {formatPrice(product.oldPrice + colorDelta + storageDelta)}
            </span>
          )}
          <div style={{ marginTop: 6 }}>
            <span className="installment">💳 {installmentLabel(price)}</span>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className={product.inStock ? 'in-stock' : 'out-stock'}>
              {product.inStock ? '✓ В наличии' : '✕ Под заказ'}
            </span>
            <span className="cashback">💰 кэшбэк {formatPrice(cashback(price))}</span>
          </div>

          {/* Цвет */}
          {product.colors && (
            <div className="option-group">
              <div className="option-group__label">Цвет: {product.colors[colorIdx].name}</div>
              <div className="swatches">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    className={`swatch ${idx === colorIdx ? 'active' : ''}`}
                    onClick={() => setColorIdx(idx)}
                  >
                    <span className="swatch__dot" style={{ background: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Память */}
          {product.storages && (
            <div className="option-group">
              <div className="option-group__label">Память</div>
              <div className="pill-options">
                {product.storages.map((s, idx) => (
                  <button
                    key={s.label}
                    className={`pill-opt ${idx === storageIdx ? 'active' : ''}`}
                    onClick={() => setStorageIdx(idx)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Действия */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              className="btn btn--ghost"
              style={{ flex: '0 0 54px' }}
              onClick={() => toggleFavorite(product.id)}
              aria-label="В избранное"
            >
              {isFav ? '❤️' : '🤍'}
            </button>
            <button
              className="btn btn--primary"
              style={{ flex: 1 }}
              disabled={!product.inStock}
              onClick={() => (inCart ? navigate('/cart') : addToCart(product.id))}
            >
              {inCart ? 'В корзине ✓' : 'В корзину'}
            </button>
          </div>
          <button
            className="btn btn--lime btn--block"
            style={{ marginTop: 10 }}
            onClick={() => setOneClick(true)}
          >
            ⚡ Купить в 1 клик
          </button>
        </div>
      </div>

      {/* Описание */}
      <section className="section">
        <p className="lead">{product.description}</p>
      </section>

      {/* Видеообзор (заглушка) */}
      <div className="video-box">
        <span style={{ fontSize: 26 }}>▶️</span>
        Видеообзор товара — скоро. Покажем распаковку и тесты камеры.
      </div>

      {/* Характеристики */}
      <section className="section">
        <div className="section-head">
          <h2>Характеристики</h2>
        </div>
        <div className="specs">
          {product.specs.map((s) => (
            <div className="specs__row" key={s.label}>
              <span className="specs__label">{s.label}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Отзывы */}
      <section className="section">
        <div className="section-head">
          <h2>Отзывы</h2>
        </div>
        <div className="stack">
          {reviews.slice(0, 2).map((r) => (
            <div className="review" key={r.id}>
              <div className="review__stars">
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </div>
              <p className="review__text">{r.text}</p>
              <div className="review__meta">
                <span className="review__author">{r.author}</span> · {r.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Похожие товары</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {oneClick && (
        <OneClickModal product={product} price={price} onClose={() => setOneClick(false)} />
      )}
    </>
  )
}
