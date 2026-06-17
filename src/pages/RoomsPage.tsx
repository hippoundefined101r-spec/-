import { useNavigate } from 'react-router-dom'
import { rooms } from '../data/rooms'
import { roomIcon } from '../icons'
import { haptic } from '../telegram'
import { Logo } from '../components/Logo'

export function RoomsPage() {
  const navigate = useNavigate()
  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <Logo size={34} />
          <span className="app-header__sub" style={{ margin: 0 }}>
            Покупки по комнатам
          </span>
        </div>
      </header>
      <div className="page">
        <div className="rooms-grid">
          {rooms.map((r) => {
            const Ic = roomIcon[r.id]
            return (
              <button
                key={r.id}
                className="room-tile"
                onClick={() => {
                  haptic('light')
                  navigate(`/room/${r.id}`)
                }}
              >
                <span className="room-tile__icon">
                  {Ic && <Ic size={30} strokeWidth={1.8} color="#0aa64b" />}
                </span>
                <span className="room-tile__title">{r.title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
