import { useNavigate } from 'react-router-dom'
import { useStore, useCartTotal } from '../store/useStore'
import { getProduct } from '../data/products'
import { formatPrice, installmentLabel } from '../utils/format'
import { EmptyState } from '../components/EmptyState'

export function CartPage() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const setQty = useStore((s) => s.setQty)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const total = useCartTotal()

  if (cart.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Корзина пуста"
        text="Добавьте товары из каталога"
        actionLabel="Перейти в каталог"
        actionTo="/catalog"
      />
    )
  }

  return (
    <>
      <h1 className="page-title">Корзина</h1>

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
            <div className="cart-item__body">
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
              <div style={{ fontWeight: 800, margin: '4px 0' }}>{formatPrice(p.price * item.qty)}</div>
              <div className="qty">
                <button onClick={() => setQty(item.productId, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => setQty(item.productId, item.qty + 1)}>+</button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              aria-label="Удалить"
              style={{ color: 'var(--text-mute)', fontSize: 18, alignSelf: 'flex-start' }}
            >
              🗑
            </button>
          </div>
        )
      })}

      <div className="summary">
        <div className="summary__row">
          <span className="muted">Товаров: {cart.reduce((s, i) => s + i.qty, 0)}</span>
          <span className="installment">💳 {installmentLabel(total)}</span>
        </div>
        <div className="summary__row summary__total">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button className="btn btn--primary btn--block" onClick={() => navigate('/checkout')}>
          Оформить заказ
        </button>
      </div>
    </>
  )
}
