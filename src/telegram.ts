// Тонкая обёртка над Telegram Web App SDK.
// Работает и вне Telegram (в обычном браузере) — тогда часть методов просто no-op.
//
// Режим строго фирменного стиля: тему Telegram НЕ применяем к фону/тексту,
// берём только хаптику, кнопки и безопасные отступы. Палитра — фирменная (styles.css).

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  initData: string
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  initDataUnsafe?: { user?: TelegramUser }
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
  requestContact?: (cb: (ok: boolean, event?: unknown) => void) => void
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
  // Строго фирменный стиль: задаём фон/заголовок в брендовый белый,
  // не перекрашиваем интерфейс под тему Telegram.
  tg.setBackgroundColor?.('#ffffff')
  tg.setHeaderColor?.('#ffffff')
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  tg?.HapticFeedback?.impactOccurred(style)
}

export function hapticSuccess() {
  tg?.HapticFeedback?.notificationOccurred('success')
}

export function getTelegramUser(): TelegramUser | undefined {
  return tg?.initDataUnsafe?.user
}

/** Сырая строка initData для авторизации на бэкенде (Authorization: tma <...>). */
export function getInitDataRaw(): string {
  return tg?.initData ?? ''
}

/**
 * Запрос номера телефона через Telegram (для связки с аккаунтом сайта).
 * Возвращает true, если пользователь поделился контактом.
 * Сам номер бэкенд получает из подписанных данных Telegram.
 */
export function requestContact(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!tg?.requestContact) {
      resolve(false)
      return
    }
    tg.requestContact((ok) => resolve(Boolean(ok)))
  })
}
