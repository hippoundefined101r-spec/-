import type { Stock } from '../types'

// Акции — блок как на главной сайта
export const stocks: Stock[] = [
  { id: 'rassrochka', title: 'Рассрочка 0-0-12', subtitle: 'На технику и мебель', accent: '#0AA64B' },
  { id: 'frozen', title: 'Заморозили цены', subtitle: 'до конца месяца', accent: '#2FE196' },
  { id: 'trade-in', title: 'Трейд-ин', subtitle: 'Старая техника в зачёт', accent: '#008A47' },
  { id: 'gift', title: 'Подарок к покупке', subtitle: 'При заказе кухни', accent: '#C42A8E' },
]
