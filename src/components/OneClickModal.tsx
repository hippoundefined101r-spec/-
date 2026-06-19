import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

interface Props {
  product: Product
  price?: number
  onClose: () => void
}

/** Покупка в один клик — только имя и телефон. */
export function OneClickModal({ product, price, onClose }: Props) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)

  const valid = name.trim().length > 1 && phone.trim().length >= 9

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 46 }}>✅</div>
            <h3 style={{ margin: '10px 0' }}>Заявка принята!</h3>
            <p className="muted">Менеджер перезвонит вам в течение 15 минут.</p>
            <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={onClose}>
              Хорошо
            </button>
          </div>
        ) : (
          <>
            <h3>Купить в 1 клик</h3>
            <p className="muted" style={{ margin: '6px 0 16px' }}>
              {product.title} · {formatPrice(price ?? product.price)}
            </p>
            <div className="field">
              <label>Ваше имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
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
            <button
              className="btn btn--primary btn--block"
              disabled={!valid}
              onClick={() => setDone(true)}
            >
              Оформить заказ
            </button>
            <p className="muted" style={{ fontSize: 12, marginTop: 10, textAlign: 'center' }}>
              Нажимая кнопку, вы соглашаетесь на обработку данных
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
