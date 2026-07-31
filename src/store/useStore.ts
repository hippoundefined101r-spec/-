import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Order } from '../types'
import { getProduct } from '../data/products'

interface AppState {
  cart: CartItem[]
  favorites: string[]
  orders: Order[]
  recentlyViewed: string[]

  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void

  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean

  addOrder: (order: Order) => void

  addRecentlyViewed: (productId: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      orders: [],
      recentlyViewed: [],

      addToCart: (productId) =>
        set((state) => {
          const existing = state.cart.find((i) => i.productId === productId)
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === productId ? { ...i, qty: i.qty + 1 } : i,
              ),
            }
          }
          return { cart: [...state.cart, { productId, qty: 1 }] }
        }),

      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((i) => i.productId !== productId) })),

      setQty: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { cart: state.cart.filter((i) => i.productId !== productId) }
          }
          return {
            cart: state.cart.map((i) => (i.productId === productId ? { ...i, qty } : i)),
          }
        }),

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),

      isFavorite: (productId) => get().favorites.includes(productId),

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      addRecentlyViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 10),
        })),
    }),
    { name: 'tehno-kg-store' },
  ),
)

// --- Производные селекторы (вне стора, чтобы не дублировать вычисления) ---

export function useCartCount() {
  return useStore((s) => s.cart.reduce((sum, i) => sum + i.qty, 0))
}

export function useCartTotal() {
  return useStore((s) =>
    s.cart.reduce((sum, i) => {
      const p = getProduct(i.productId)
      return sum + (p ? p.price * i.qty : 0)
    }, 0),
  )
}
