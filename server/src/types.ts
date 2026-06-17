// Доменные типы и контракт API. Совпадают по смыслу с фронтовыми (src/types.ts),
// чтобы переход фронта на реальный API был бесшовным.

export interface Category {
  id: string
  title: string
  icon: string
}

export interface Room {
  id: string
  title: string
  icon: string
}

export interface Spec {
  label: string
  value: string
}

export interface Product {
  id: string
  title: string
  categoryId: string
  /** К каким «комнатам» относится товар */
  rooms: string[]
  brand: string
  /** Цена в рублях (RUB) */
  price: number
  /** Старая цена для отображения скидки */
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
  description: string
  specs: Spec[]
}

export interface Stock {
  id: string
  title: string
  subtitle?: string
  image?: string
  /** Акцентный цвет плашки */
  accent?: string
}

export type DeliveryMethod = 'courier' | 'pickup'

export interface OrderItem {
  productId: string
  title: string
  price: number
  qty: number
}

export type OrderStatus = 'new' | 'processing' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId: number
  createdAt: number
  items: OrderItem[]
  total: number
  name: string
  phone: string
  delivery: DeliveryMethod
  /** Адрес доставки (для courier) или адрес магазина (для pickup) */
  address: string
  comment?: string
  status: OrderStatus
}

/** Параметры выборки товаров */
export interface ProductQuery {
  q?: string
  category?: string
  room?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'discount'
  limit?: number
  offset?: number
}

export interface ProductList {
  items: Product[]
  total: number
}

/** Пользователь Telegram, опционально связанный с профилем Bitrix */
export interface AppUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  /** Телефон после requestContact + верификации */
  phone?: string
  /** ID профиля в Bitrix после успешного матча */
  bitrixUserId?: string
}
