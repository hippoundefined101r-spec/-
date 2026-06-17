import { Logo } from './Logo'

// Экран приветствия при запуске Mini App: логотип КИРГУ.
export function Splash({ hiding }: { hiding: boolean }) {
  return (
    <div className={`splash ${hiding ? 'splash--hide' : ''}`}>
      <div className="splash__logo">
        <Logo size={56} />
        <div className="splash__tag">Дом, в котором есть всё!</div>
      </div>
    </div>
  )
}
