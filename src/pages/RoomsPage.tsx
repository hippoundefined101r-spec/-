import { useNavigate } from 'react-router-dom'
import { rooms } from '../data/rooms'
import { haptic } from '../telegram'

export function RoomsPage() {
  const navigate = useNavigate()
  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">КИРГУ</div>
        <div className="app-header__sub">Покупки по комнатам</div>
      </header>
      <div className="page">
        <div className="rooms-grid">
          {rooms.map((r) => (
            <button
              key={r.id}
              className="room-tile"
              onClick={() => {
                haptic('light')
                navigate(`/room/${r.id}`)
              }}
            >
              <span className="room-tile__icon">{r.icon}</span>
              <span className="room-tile__title">{r.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
