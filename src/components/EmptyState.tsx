import { useNavigate } from 'react-router-dom'

interface Props {
  icon: string
  title: string
  text?: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ icon, title, text, actionLabel, actionTo }: Props) {
  const navigate = useNavigate()
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <div className="empty__title">{title}</div>
      {text && <div className="empty__text">{text}</div>}
      {actionLabel && actionTo && (
        <button
          className="btn btn--primary"
          style={{ maxWidth: 240, marginInline: 'auto' }}
          onClick={() => navigate(actionTo)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
