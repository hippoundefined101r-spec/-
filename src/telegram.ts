// Тонкая обёртка над Telegram Web App SDK.
// Работает и вне Telegram (в обычном браузере) — тогда часть методов просто no-op.

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  initDataUnsafe?: {
    user?: { id: number; first_name: string; last_name?: string; username?: string }
  }
  MainButton: {
    setText: (t: string) => void
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
    enable: () => void
    disable: () => void
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export const tg = window.Telegram?.WebApp

export function initTelegram() {
  if (!tg) return
  tg.ready()
  tg.expand()
  // Применяем цвета темы Telegram к CSS-переменным, если они переданы.
  const root = document.documentElement
  const tp = tg.themeParams || {}
  const map: Record<string, string> = {
    bg_color: '--tg-bg',
    secondary_bg_color: '--tg-secondary-bg',
    text_color: '--tg-text',
    hint_color: '--tg-hint',
    link_color: '--tg-link',
    button_color: '--tg-button',
    button_text_color: '--tg-button-text',
  }
  Object.entries(map).forEach(([k, cssVar]) => {
    if (tp[k]) root.style.setProperty(cssVar, tp[k])
  })
  if (tg.colorScheme === 'dark') root.classList.add('dark')
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  tg?.HapticFeedback?.impactOccurred(style)
}

export function hapticSuccess() {
  tg?.HapticFeedback?.notificationOccurred('success')
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user
}
