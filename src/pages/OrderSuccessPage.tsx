import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = (location.state as { orderId?: string } | null)?.orderId

  return (
    <motion.div
      className="empty"
      style={{ paddingTop: 70 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty__icon">✅</div>
      <div className="empty__title">Заказ оформлен!</div>
      {orderId && (
        <div className="empty__text">
          Номер заказа: <b style={{ color: 'var(--text)' }}>{orderId}</b>
        </div>
      )}
      <p className="muted" style={{ maxWidth: 320, margin: '0 auto 20px' }}>
        Менеджер свяжется с вами для подтверждения в течение 15 минут.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 260, margin: '0 auto' }}>
        <button className="btn btn--primary btn--block" onClick={() => navigate('/orders')}>
          Мои заказы
        </button>
        <button className="btn btn--ghost btn--block" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    </motion.div>
  )
}
