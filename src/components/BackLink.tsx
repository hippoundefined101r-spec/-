import { useNavigate } from 'react-router-dom'

export function BackLink({ label = 'Назад' }: { label?: string }) {
  const navigate = useNavigate()
  return (
    <button className="back-link" onClick={() => navigate(-1)}>
      ‹ {label}
    </button>
  )
}
