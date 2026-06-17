import { useNavigate } from 'react-router-dom'
import { useStore, useCartTotal } from '../store/useStore'
import { getProduct } from '../data/products'
import { formatPrice } from '../utils/format'
import { haptic } from '../telegram'
import { EmptyState } from '../components/EmptyState'

export function CartPage() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const setQty = useStore((s) => s.setQty)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const total = useCartTotal()

  if (cart.length === 0) {
    return (
      <div className="page">
        <EmptyState
          icon="🛒"
          title="Корзина пуста"
          text="Добавьте товары из каталога"
          actionLabel="Перейти в каталог"
          actionTo="/"
        />
      </div>
    )
  }

  return (
    <>
      <div className="page">
        <h2 style={{ marginTop: 4 }}>Корзина</h2>
        {cart.map((item) => {
          const p = getProduct(item.productId)
          if (!p) return null
          return (
            <div className="cart-item" key={item.productId}>
              <img
                className="cart-item__img"
                src={p.image}
                alt={p.title}
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
              <div className="cart-item__info">
                <div className="cart-item__title">{p.title}</div>
                <div className="cart-item__price">{formatPrice(p.price * item.qty)}</div>
                <div className="qty">
                  <button
                    onClick={() => {
                      haptic('light')
                      setQty(item.productId, item.qty - 1)
                    }}
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => {
                      haptic('light')
                      setQty(item.productId, item.qty + 1)
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="cart-item__remove"
                onClick={() => {
                  haptic('medium')
                  removeFromCart(item.productId)
                }}
                aria-label="Удалить"
              >
                🗑
              </button>
            </div>
          )
        })}
      </div>

      <div className="summary">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 10,
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          <span>Итого:</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            haptic('medium')
            navigate('/checkout')
          }}
        >
          Оформить заказ
        </button>
      </div>
    </>
  )
}
