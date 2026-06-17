import type { AppUser, Order } from './types.js'

// Простое in-memory хранилище для MVP. На этапе 2 заменяется на БД/Bitrix.
const users = new Map<number, AppUser>()
const orders = new Map<string, Order>()

export const store = {
  upsertUser(user: AppUser): AppUser {
    const existing = users.get(user.id)
    const merged = { ...existing, ...user }
    users.set(user.id, merged)
    return merged
  },

  getUser(id: number): AppUser | undefined {
    return users.get(id)
  },

  linkPhone(id: number, phone: string, bitrixUserId?: string): AppUser | undefined {
    const u = users.get(id)
    if (!u) return undefined
    u.phone = phone
    if (bitrixUserId) u.bitrixUserId = bitrixUserId
    users.set(id, u)
    return u
  },

  addOrder(order: Order): Order {
    orders.set(order.id, order)
    return order
  },

  ordersByUser(userId: number): Order[] {
    return [...orders.values()]
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  },
}

/**
 * Поиск профиля в Bitrix по телефону — заглушка под этап 2.
 * Вернёт bitrixUserId, если профиль найден (там будет REST-запрос к Bitrix).
 */
export async function findBitrixUserByPhone(_phone: string): Promise<string | undefined> {
  return undefined
}
