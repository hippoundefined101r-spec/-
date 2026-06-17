export interface Category {
  id: string
  title: string
  icon: string
}

export interface Product {
  id: string
  title: string
  categoryId: string
  brand: string
  /** Цена в рублях (RUB) */
  price: number
  /** Старая цена для отображения скидки (необязательно) */
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
  description: string
  specs: { label: string; value: string }[]
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
export type PaymentMethod = 'cash' | 'card'

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
