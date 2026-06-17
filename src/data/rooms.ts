import type { Room } from '../types'

// «Покупки по комнатам» — фирменная навигация kirgu.ru
export const rooms: Room[] = [
  { id: 'gostinaya', title: 'Гостиная', icon: '🛋️' },
  { id: 'spalnya', title: 'Спальня', icon: '🛏️' },
  { id: 'detskaya', title: 'Детская', icon: '🧸' },
  { id: 'kuhnya', title: 'Кухня', icon: '🍳' },
  { id: 'prihozhaya', title: 'Прихожая', icon: '🚪' },
  { id: 'dom-sad', title: 'Дом и сад', icon: '🌳' },
  { id: 'ofis', title: 'Офис', icon: '💼' },
  { id: 'vannaya', title: 'Ванная', icon: '🛁' },
]

export const getRoom = (id: string) => rooms.find((r) => r.id === id)
