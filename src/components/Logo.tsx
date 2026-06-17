// Логотип КИРГУ: зелёный квадрат с белой надписью «КИРГУ».
// Вектор — чёткий на любом размере. Используется на сплэше и в шапке.
export function Logo({ size = 120, rounded = true }: { size?: number; rounded?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="КИРГУ"
      style={{ display: 'block' }}
    >
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
