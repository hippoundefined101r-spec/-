import { useStore } from '../store/useStore'
import { formatPrice, formatDate } from '../utils/format'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'

const statusLabel: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  delivered: 'Доставлен',
}

const paymentLabel: Record<string, string> = {
  cash: 'Наличными',
  card: 'Картой',
  installment: 'Рассрочка 0%',
}

export function OrdersPage() {
  const orders = useStore((s) => s.orders)

  return (
    <>
      <BackLink />
      <h1 className="page-title">Мои заказы</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Заказов пока нет"
          text="Оформите первый заказ в каталоге"
          actionLabel="В каталог"
          actionTo="/catalog"
        />
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div className="panel" key={order.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <b>№ {order.id}</b>
                <span className="muted">{formatDate(order.createdAt)}</span>
              </div>
              <span className="tag" style={{ margin: '8px 0', display: 'inline-block' }}>
                {statusLabel[order.status]}
              </span>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                {order.items.map((it, idx) => (
                  <div key={idx}>
                    {it.title} × {it.qty}
                  </div>
                ))}
              </div>
              <div style={{ fontWeight: 800, marginTop: 8 }}>Итого: {formatPrice(order.total)}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                {order.delivery === 'pickup' ? 'Самовывоз' : `Доставка: ${order.address}`} ·{' '}
                {paymentLabel[order.payment]}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
