import { useNavigate } from 'react-router-dom'
import { haptic } from '../telegram'

export function BackLink({ label = 'Назад' }: { label?: string }) {
  const navigate = useNavigate()
  return (
    <button
      className="back-btn"
      onClick={() => {
        haptic('light')
        navigate(-1)
      }}
    >
      ‹ {label}
    </button>
  )
}
