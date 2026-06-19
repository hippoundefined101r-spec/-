import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, useCartTotal } from '../store/useStore'
import { getProduct } from '../data/products'
import { formatPrice, installmentLabel } from '../utils/format'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'
import { CITY } from '../config'
import type { DeliveryMethod, PaymentMethod, Order } from '../types'

export function CheckoutPage() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const clearCart = useStore((s) => s.clearCart)
  const addOrder = useStore((s) => s.addOrder)
  const total = useCartTotal()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod>('courier')
  const [region, setRegion] = useState<'city' | 'russia'>('city')
  const [payment, setPayment] = useState<PaymentMethod>('installment')

  if (cart.length === 0) {
    return (
      <div>
        <BackLink />
        <EmptyState icon="🛒" title="Корзина пуста" actionLabel="В каталог" actionTo="/catalog" />
      </div>
    )
  }

  const deliveryCost = delivery === 'pickup' ? 0 : region === 'city' ? 300 : 600
  const grandTotal = total + deliveryCost

  const valid =
    name.trim().length > 1 &&
    phone.trim().length >= 9 &&
    (delivery === 'pickup' || address.trim().length > 3)

  const submit = () => {
    const order: Order = {
      id: `PH-${Date.now().toString().slice(-6)}`,
      createdAt: Date.now(),
      items: cart.map((i) => {
        const p = getProduct(i.productId)!
        return { title: p.title, price: p.price, qty: i.qty }
      }),
      total: grandTotal,
      name: name.trim(),
      phone: phone.trim(),
      address: delivery === 'pickup' ? `Самовывоз, ${CITY}` : address.trim(),
      delivery,
      payment,
      status: 'new',
    }
    addOrder(order)
    clearCart()
    navigate('/order-success', { state: { orderId: order.id } })
  }

  return (
    <>
      <BackLink />
      <h1 className="page-title">Оформление заказа</h1>

      <div className="section-head">
        <h2 style={{ fontSize: 16 }}>Контактные данные</h2>
      </div>
      <div className="field">
        <label>Имя получателя</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
      </div>
      <div className="field">
        <label>Телефон</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 900 000-00-00"
          inputMode="tel"
        />
      </div>

      <div className="section-head" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 16 }}>Способ получения</h2>
      </div>
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
        <>
          <div className="radio-group" style={{ marginTop: 10 }}>
            <button
              className={`radio ${region === 'city' ? 'active' : ''}`}
              onClick={() => setRegion('city')}
            >
              По городу · 300 ₽
            </button>
            <button
              className={`radio ${region === 'russia' ? 'active' : ''}`}
              onClick={() => setRegion('russia')}
            >
              По России · 600 ₽
            </button>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Адрес доставки</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, дом, квартира"
              rows={2}
            />
          </div>
        </>
      )}

      <div className="section-head" style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 16 }}>Оплата</h2>
      </div>
      <div className="radio-group radio-group--3">
        <button
          className={`radio ${payment === 'installment' ? 'active' : ''}`}
          onClick={() => setPayment('installment')}
        >
          💳 Рассрочка 0%
        </button>
        <button
          className={`radio ${payment === 'card' ? 'active' : ''}`}
          onClick={() => setPayment('card')}
        >
          💳 Картой
        </button>
        <button
          className={`radio ${payment === 'cash' ? 'active' : ''}`}
          onClick={() => setPayment('cash')}
        >
          💵 Наличными
        </button>
      </div>
      {payment === 'installment' && (
        <p className="installment" style={{ marginTop: 10 }}>
          Платёж {installmentLabel(grandTotal)} — без переплат
        </p>
      )}

      <div className="specs" style={{ marginTop: 18 }}>
        <div className="specs__row">
          <span className="specs__label">Товары</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="specs__row">
          <span className="specs__label">Доставка</span>
          <span>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span>
        </div>
        <div className="specs__row" style={{ fontWeight: 800 }}>
          <span>Итого</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div className="summary">
        <button className="btn btn--primary btn--block" disabled={!valid} onClick={submit}>
          Подтвердить заказ · {formatPrice(grandTotal)}
        </button>
      </div>
    </>
  )
}
