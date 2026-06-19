// Логотип в стиле бренда FIX APPLE: синий «лист + волна» на чёрном круге,
// словесный знак FIX (серый) APPLE (синий).

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="logo__mark"
      style={{
        width: size,
        height: size,
        background: '#000',
        border: '1.5px solid var(--accent)',
        boxShadow: 'none',
      }}
    >
      <svg viewBox="0 0 48 48" width={size * 0.62} height={size * 0.62} aria-hidden="true">
        {/* лист */}
        <path
          d="M27 15c1.8-4.6 7-6 7-6s-.6 5.3-3.6 7.2C29 17.3 26.4 16.8 27 15Z"
          fill="var(--accent)"
        />
        {/* волны (тело «яблока») */}
        <path
          d="M9 27c6-4 10 2 15 2s9-6 15-2"
          stroke="var(--accent)"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M13 33c4.5-3 7.5 1.4 11 1.4S31 31 35 33"
          stroke="var(--accent)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </span>
  )
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo__name">
        <span className="logo__fix">FIX</span>
        <span className="logo__apple">APPLE</span>
      </span>
    </span>
  )
}
