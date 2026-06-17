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
      <div style={{ fontWeight: 600, color: 'var(--tg-text)', marginBottom: 6 }}>{title}</div>
      {text && <div>{text}</div>}
      {actionLabel && actionTo && (
        <button
          className="btn-primary"
          style={{ marginTop: 20, maxWidth: 240, marginInline: 'auto' }}
          onClick={() => navigate(actionTo)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
