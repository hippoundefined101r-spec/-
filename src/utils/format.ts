/** Форматирует цену в сомах: 119900 -> "119 900 сом" */
export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} сом`
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
