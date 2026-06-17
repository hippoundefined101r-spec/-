import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, useCartTotal } from '../store/useStore'
import { getProduct } from '../data/products'
import { formatPrice } from '../utils/format'
import { hapticSuccess, getTelegramUser } from '../telegram'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'
import type { DeliveryMethod, PaymentMethod, Order } from '../types'

export function CheckoutPage() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const clearCart = useStore((s) => s.clearCart)
  const addOrder = useStore((s) => s.addOrder)
  const total = useCartTotal()

  const tgUser = getTelegramUser()
  const [name, setName] = useState(tgUser?.first_name ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod>('courier')
  const [payment, setPayment] = useState<PaymentMethod>('cash')

  if (cart.length === 0) {
    return (
      <div className="page">
        <BackLink />
        <EmptyState icon="🛒" title="Корзина пуста" actionLabel="В каталог" actionTo="/" />
      </div>
    )
  }

  const deliveryCost = delivery === 'courier' ? 300 : 0
  const grandTotal = total + deliveryCost

  const valid =
    name.trim().length > 1 &&
    phone.trim().length >= 9 &&
    (delivery === 'pickup' || address.trim().length > 3)

  const submit = () => {
    const order: Order = {
      id: `KG-${Date.now().toString().slice(-6)}`,
      createdAt: Date.now(),
      items: cart.map((i) => {
        const p = getProduct(i.productId)!
        return { title: p.title, price: p.price, qty: i.qty }
      }),
      total: grandTotal,
      name: name.trim(),
      phone: phone.trim(),
      address: delivery === 'pickup' ? 'Самовывоз' : address.trim(),
      delivery,
      payment,
      status: 'new',
    }
    addOrder(order)
    clearCart()
    hapticSuccess()
    navigate('/order-success', { state: { orderId: order.id } })
  }

  return (
    <>
      <div className="page">
        <BackLink />
        <h2 style={{ marginTop: 4 }}>Оформление заказа</h2>

        <div className="section-title">Контактные данные</div>
        <div className="field">
          <label>Имя получателя</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
        </div>
        <div className="field">
          <label>Телефон</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+996 700 000 000"
            inputMode="tel"
          />
        </div>

        <div className="section-title">Способ получения</div>
        <div className="radio-group">
          <button
            className={`radio ${delivery === 'courier' ? 'active' : ''}`}
            onClick={() => setDelivery('courier')}
          >
            🚚 Доставка
          </button>
          <button
            className={`radio ${delivery === 'pickup' ? 'active' : ''}`}
            onClick={() => setDelivery('pickup')}
          >
            🏬 Самовывоз
          </button>
        </div>

        {delivery === 'courier' && (
          <div className="field" style={{ marginTop: 12 }}>
            <label>Адрес доставки</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, дом, квартира"
              rows={2}
            />
          </div>
        )}

        <div className="section-title">Оплата</div>
        <div className="radio-group">
          <button
            className={`radio ${payment === 'cash' ? 'active' : ''}`}
            onClick={() => setPayment('cash')}
          >
            💵 Наличными
          </button>
          <button
            className={`radio ${payment === 'card' ? 'active' : ''}`}
            onClick={() => setPayment('card')}
          >
            💳 Картой
          </button>
        </div>

        <div className="specs" style={{ marginTop: 18 }}>
          <div className="specs__row">
            <span className="specs__label">Товары</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="specs__row">
            <span className="specs__label">Доставка</span>
            <span>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span>
          </div>
          <div className="specs__row" style={{ fontWeight: 700 }}>
            <span>Итого</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="summary">
        <button className="btn-primary" disabled={!valid} onClick={submit}>
          Подтвердить заказ · {formatPrice(grandTotal)}
        </button>
      </div>
    </>
  )
}
