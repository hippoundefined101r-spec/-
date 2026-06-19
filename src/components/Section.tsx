import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  title: string
  link?: { to: string; label: string }
  children: ReactNode
}

/** Секция главной/страницы с заголовком и опциональной ссылкой «смотреть все». */
export function Section({ title, link, children }: Props) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {link && <Link to={link.to}>{link.label} →</Link>}
      </div>
      {children}
    </section>
  )
}
