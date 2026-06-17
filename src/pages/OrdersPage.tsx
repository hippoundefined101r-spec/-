import { Package } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatPrice, formatDate } from '../utils/format'
import { BackLink } from '../components/BackLink'
import { EmptyState } from '../components/EmptyState'

const statusLabel: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  delivered: 'Доставлен',
}

export function OrdersPage() {
  const orders = useStore((s) => s.orders)

  return (
    <div className="page">
      <BackLink />
      <h2 style={{ marginTop: 4 }}>Мои заказы</h2>
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Заказов пока нет"
          text="Оформите первый заказ в каталоге"
          actionLabel="В каталог"
          actionTo="/"
        />
      ) : (
        orders.map((order) => (
          <div className="order" key={order.id}>
            <div className="order__head">
              <span>№ {order.id}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="order__status">{statusLabel[order.status]}</div>
            <div className="order__items">
              {order.items.map((it, idx) => (
                <div key={idx} style={{ color: 'var(--tg-hint)' }}>
                  {it.title} × {it.qty}
                </div>
              ))}
            </div>
            <div className="order__total">Итого: {formatPrice(order.total)}</div>
            <div style={{ fontSize: 13, color: 'var(--tg-hint)', marginTop: 4 }}>
              {order.delivery === 'pickup' ? 'Самовывоз' : `Доставка: ${order.address}`} ·{' '}
              {order.payment === 'cash' ? 'Наличными' : 'Картой'}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
