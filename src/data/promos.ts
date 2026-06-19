import type { Promo, Review, BlogPost } from '../types'

export const promos: Promo[] = [
  {
    id: 'installment',
    title: 'Рассрочка 0%',
    subtitle: 'На смартфоны и технику — до 24 месяцев без переплат',
    cta: 'Купить в рассрочку',
    to: '/catalog',
    gradient: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
    emoji: '💳',
  },
  {
    id: 'tradein',
    title: 'Трейд-ин: обмен с доплатой',
    subtitle: 'Сдай старый смартфон — получи скидку на новый',
    cta: 'Оценить телефон',
    to: '/trade-in',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #2BD27A 100%)',
    emoji: '🔄',
  },
  {
    id: 'iphone',
    title: 'iPhone 15 Pro Max',
    subtitle: 'Титан. Камера 48 Мп. Уже в наличии в Махачкале',
    cta: 'Смотреть',
    to: '/product/iphone-15-pro-max',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FF5C77 100%)',
    emoji: '📱',
  },
]

export const advantages = [
  { icon: '✅', title: 'Только оригинал', text: 'Официальная техника, проверка при вас' },
  { icon: '🛡️', title: 'Гарантия 1 год', text: 'Собственный сервисный центр' },
  { icon: '🚚', title: 'Доставка по РФ', text: 'Курьер по городу и почта по России' },
  { icon: '💳', title: 'Рассрочка 0%', text: 'Оформление за 5 минут без переплат' },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Магомед',
    city: 'Махачкала',
    rating: 5,
    text: 'Брал iPhone 15 Pro в рассрочку, всё оформили за 10 минут. Телефон оригинал, проверили при мне.',
    date: '12 мая 2026',
  },
  {
    id: 'r2',
    author: 'Патимат',
    city: 'Каспийск',
    rating: 5,
    text: 'Сдала старый телефон по трейд-ину, доплата получилась небольшой. Очень довольна, спасибо!',
    date: '3 июня 2026',
  },
  {
    id: 'r3',
    author: 'Расул',
    city: 'Дербент',
    rating: 4,
    text: 'Заказывал доставку — привезли на следующий день. Наушники топ, цена ниже чем у конкурентов.',
    date: '28 мая 2026',
  },
  {
    id: 'r4',
    author: 'Аминат',
    city: 'Махачкача',
    rating: 5,
    text: 'Ребята серьёзные, помогли с выбором и настроили телефон. Буду рекомендовать друзьям.',
    date: '9 июня 2026',
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'iPhone 15 или 15 Pro: что выбрать в 2026',
    excerpt: 'Разбираем разницу в камерах, экране и чипе, чтобы не переплатить.',
    date: '5 июня 2026',
    emoji: '📱',
  },
  {
    id: 'b2',
    title: 'Как работает трейд-ин и сколько дадут за ваш телефон',
    excerpt: 'Пошагово объясняем оценку, доплату и оформление обмена.',
    date: '1 июня 2026',
    emoji: '🔄',
  },
  {
    id: 'b3',
    title: 'Топ-5 наушников с шумоподавлением',
    excerpt: 'Сравниваем AirPods Pro 2, Sony XM5 и другие модели.',
    date: '24 мая 2026',
    emoji: '🎧',
  },
]
