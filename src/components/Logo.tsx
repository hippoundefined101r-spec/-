// Официальный логотип КИРГУ (зелёная надпись со срезами) из public/logo.svg.
// Лежит в репозитории и отдаётся с того же домена → одинаково на ПК и телефоне.
// Это широкая надпись (≈196×40), поэтому размер задаём по высоте, ширина — авто.
const LOGO_SRC = `${import.meta.env.BASE_URL}logo.svg`

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <img
      src={LOGO_SRC}
      alt="КИРГУ"
      style={{ height: size, width: 'auto', maxWidth: '100%', display: 'block' }}
    />
  )
}
