import { useState } from 'react'

// Официальный логотип КИРГУ. Загружается в браузере пользователя напрямую с сайта,
// поэтому отображается ровно как оригинал (со всеми срезами букв).
// Если не отдастся — показываем векторный фолбэк.
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
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: rounded ? Math.round(size * 0.12) : 0,
      }}
    />
  )
}

// Запасной векторный логотип. Без textLength (его игнорируют некоторые мобильные
// рендереры, из-за чего надпись вылезала за края и обрезались К и У). Шрифт умещается
// с запасом по краям.
function LogoVector({ size, rounded }: { size: number; rounded: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="КИРГУ" style={{ display: 'block' }}>
      <rect width="100" height="100" rx={rounded ? 8 : 0} fill="#15924f" />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Manrope', 'Arial Black', Arial, sans-serif"
        fontWeight={800}
        fontSize={20}
        fill="#ffffff"
      >
        КИРГУ
      </text>
    </svg>
  )
}
