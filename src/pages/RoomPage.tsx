import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { products } from '../data/products'
import { getRoom } from '../data/rooms'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'
import { BackLink } from '../components/BackLink'

export function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const room = id ? getRoom(id) : undefined
  const items = useMemo(() => products.filter((p) => id && p.rooms.includes(id)), [id])

  return (
    <div className="page">
      <BackLink />
      <h2 style={{ margin: '4px 0 8px' }}>
        {room ? `${room.icon} ${room.title}` : 'Комната'}
      </h2>
      {items.length === 0 ? (
        <EmptyState icon="📭" title="Пока пусто" text="В этой комнате нет товаров" />
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
