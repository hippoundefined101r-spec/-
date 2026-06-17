// Клиент REST API бэкенда. Контракт совпадает с server/.
// На этапе 2 экраны переключаются с локальных моков на эти вызовы.
//
// Все защищённые запросы несут заголовок `Authorization: tma <initDataRaw>`.

import type { Category, Order, Product, Room, Stock } from '../types'
import { getInitDataRaw } from '../telegram'

const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '/api'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const initData = getInitDataRaw()
  if (initData) headers.set('Authorization', `tma ${initData}`)

  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, (body as { message?: string }).message ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export interface ProductFilters {
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

export const api = {
  getCategories: () => request<Category[]>('/catalog/categories'),
  getRooms: () => request<Room[]>('/catalog/rooms'),
  getBrands: () => request<string[]>('/catalog/brands'),
  getStocks: () => request<Stock[]>('/stocks'),

  getProducts: (filters: ProductFilters = {}) => {
    const qs = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') qs.set(k, String(v))
    })
    const suffix = qs.toString() ? `?${qs}` : ''
    return request<{ items: Product[]; total: number }>(`/catalog/products${suffix}`)
  },

  getProduct: (id: string) => request<{ product: Product; similar: Product[] }>(`/catalog/products/${id}`),

  // Авторизация / связка контакта
  authTelegram: () => request<{ user: unknown }>('/auth/telegram', { method: 'POST' }),
  linkContact: (phone: string) =>
    request<{ user: unknown; linked: boolean }>('/auth/link-contact', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  // Заказы
  getOrders: () => request<{ items: Order[] }>('/orders'),
  createOrder: (payload: {
    items: { productId: string; qty: number }[]
    name: string
    phone: string
    delivery: 'courier' | 'pickup'
    address: string
    comment?: string
  }) => request<{ order: Order }>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
}
