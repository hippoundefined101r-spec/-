/** Форматирует цену в рублях: 119900 -> "119 900 ₽" */
export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`
}

/** Кэшбэк бонусами ~2% от цены, округлённый до 10 ₽ */
export function cashback(price: number): number {
  return Math.round((price * 0.02) / 10) * 10
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
