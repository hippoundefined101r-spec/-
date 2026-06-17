// Экран приветствия при запуске Mini App: логотип КИРГУ на фирменном фоне.
export function Splash({ hiding }: { hiding: boolean }) {
  return (
    <div className={`splash ${hiding ? 'splash--hide' : ''}`}>
      <div className="splash__logo">
        <div className="splash__badge">К</div>
        <div className="splash__word">КИРГУ</div>
        <div className="splash__tag">Дом, в котором есть всё!</div>
      </div>
    </div>
  )
}
