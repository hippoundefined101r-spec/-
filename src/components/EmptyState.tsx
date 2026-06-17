import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  text?: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ icon: Icon, title, text, actionLabel, actionTo }: Props) {
  const navigate = useNavigate()
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon size={44} strokeWidth={1.5} color="#c2c9d1" />
      </div>
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
