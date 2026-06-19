export interface Category {
  id: string
  title: string
  icon: string
}

/** Вариант исполнения товара (цвет / объём памяти), может менять цену */
export interface Variant {
  /** Доплата к базовой цене (может быть 0 или отрицательной) */
  priceDelta: number
}

export interface ColorVariant extends Variant {
  name: string
  /** HEX для кружка-свотча */
  hex: string
}

export interface StorageVariant extends Variant {
  /** Например "256 ГБ" */
  label: string
}

export interface Product {
  id: string
  title: string
  categoryId: string
  brand: string
  /** Базовая цена в рублях (RUB) */
  price: number
  /** Старая цена для отображения скидки (необязательно) */
  oldPrice?: number
  rating: number
  reviews: number
  /** Главное изображение */
  image: string
  /** Галерея (включая главное) */
  gallery?: string[]
  inStock: boolean
  /** Бейджи витрины */
  isHit?: boolean
  isNew?: boolean
  description: string
  specs: { label: string; value: string }[]
  colors?: ColorVariant[]
  storages?: StorageVariant[]
}

export interface CartItem {
  productId: string
  qty: number
}

export interface OrderItem {
  title: string
  price: number
  qty: number
}

export type DeliveryMethod = 'courier' | 'pickup'
export type PaymentMethod = 'cash' | 'card' | 'installment'

export interface Order {
  id: string
  createdAt: number
  items: OrderItem[]
  total: number
  name: string
  phone: string
  address: string
  delivery: DeliveryMethod
  payment: PaymentMethod
  status: 'new' | 'processing' | 'delivered'
}

export interface Promo {
  id: string
  title: string
  subtitle: string
  cta: string
  to: string
  /** CSS-градиент для фона баннера */
  gradient: string
  emoji: string
}

export interface Review {
  id: string
  author: string
  city: string
  rating: number
  text: string
  date: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  emoji: string
}
