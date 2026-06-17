import { useState } from 'react'

// Официальный логотип КИРГУ. Загружается в браузере пользователя напрямую с сайта,
// поэтому отображается ровно как оригинал (со всеми срезами букв).
// Если по какой-то причине не отдастся — показываем векторный фолбэк.
const OFFICIAL_LOGO = 'https://kirgu.ru/logo.svg'

export function Logo({ size = 120, rounded = true }: { size?: number; rounded?: boolean }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <LogoVector size={size} rounded={rounded} />

  return (
    <img
      src={OFFICIAL_LOGO}
      alt="КИРГУ"
      onError={() => setFailed(true)}
      style={{
        height: size,
        width: 'auto',
        display: 'block',
        borderRadius: rounded ? Math.round(size * 0.12) : 0,
      }}
    />
  )
}

// Запасной векторный логотип (если официальный файл недоступен).
function LogoVector({ size, rounded }: { size: number; rounded: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="КИРГУ" style={{ display: 'block' }}>
      <rect width="100" height="100" rx={rounded ? 8 : 0} fill="#15924f" />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Manrope', 'Arial Black', Arial, sans-serif"
        fontWeight={800}
        fontSize={30}
        fill="#ffffff"
        textLength={80}
        lengthAdjust="spacingAndGlyphs"
      >
        КИРГУ
      </text>
    </svg>
  )
}
