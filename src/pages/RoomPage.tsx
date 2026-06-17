import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { products } from '../data/products'
import { getRoom } from '../data/rooms'
import { PackageOpen } from 'lucide-react'
import { roomIcon } from '../icons'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'
import { BackLink } from '../components/BackLink'

export function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const room = id ? getRoom(id) : undefined
  const Ic = id ? roomIcon[id] : undefined
  const items = useMemo(() => products.filter((p) => id && p.rooms.includes(id)), [id])

  return (
    <div className="page">
      <BackLink />
      <h2 style={{ margin: '4px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {Ic && <Ic size={24} strokeWidth={1.8} color="#0aa64b" />}
        {room ? room.title : 'Комната'}
      </h2>
      {items.length === 0 ? (
        <EmptyState icon={PackageOpen} title="Пока пусто" text="В этой комнате нет товаров" />
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
