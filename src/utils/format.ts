import { INSTALLMENT_MONTHS } from '../config'

/** Форматирует цену в рублях: 119900 -> "119 900 ₽" */
export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`
}

/** Кэшбэк бонусами ~3% от цены, округлённый до 10 ₽ */
export function cashback(price: number): number {
  return Math.round((price * 0.03) / 10) * 10
}

/** Платёж по рассрочке 0% за указанное число месяцев (по умолчанию из конфига) */
export function installment(price: number, months: number = INSTALLMENT_MONTHS): number {
  return Math.ceil(price / months / 10) * 10
}

/** "от 4 990 ₽/мес" */
export function installmentLabel(price: number, months: number = INSTALLMENT_MONTHS): string {
  return `от ${formatPrice(installment(price, months))}/мес`
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
