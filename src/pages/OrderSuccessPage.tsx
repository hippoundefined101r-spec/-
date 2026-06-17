import { useLocation, useNavigate } from 'react-router-dom'

export function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = (location.state as { orderId?: string } | null)?.orderId

  return (
    <div className="page">
      <div className="empty" style={{ paddingTop: 80 }}>
        <div className="empty__icon">✅</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--tg-text)', marginBottom: 8 }}>
          Заказ оформлен!
        </div>
        {orderId && (
          <div style={{ marginBottom: 6 }}>
            Номер заказа: <b style={{ color: 'var(--tg-text)' }}>{orderId}</b>
          </div>
        )}
        <div>Наш менеджер свяжется с вами для подтверждения.</div>
        <button
          className="btn-primary"
          style={{ marginTop: 24, maxWidth: 260, marginInline: 'auto' }}
          onClick={() => navigate('/orders')}
        >
          Мои заказы
        </button>
        <button
          className="btn-secondary"
          style={{ marginTop: 10, maxWidth: 260, marginInline: 'auto' }}
          onClick={() => navigate('/')}
        >
          Вернуться в каталог
        </button>
      </div>
    </div>
  )
}
