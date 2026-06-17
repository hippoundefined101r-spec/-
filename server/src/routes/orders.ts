import crypto from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../auth.js'
import { store } from '../store.js'
import type { CatalogSource } from '../catalog/index.js'
import type { DeliveryMethod, Order, OrderItem } from '../types.js'

interface CreateOrderBody {
  items: { productId: string; qty: number }[]
  name: string
  phone: string
  delivery: DeliveryMethod
  address: string
  comment?: string
}

export function orderRoutes(source: CatalogSource) {
  return async function (app: FastifyInstance) {
    app.get('/orders', { preHandler: requireAuth }, async (req) => {
      return { items: store.ordersByUser(req.appUser!.id) }
    })

    app.post('/orders', { preHandler: requireAuth }, async (req, reply) => {
      const body = (req.body ?? {}) as Partial<CreateOrderBody>

      if (!body.items?.length) {
        reply.code(400).send({ error: 'bad_request', message: 'Пустая корзина' })
        return
      }
      if (!body.name || !body.phone || !body.delivery) {
        reply.code(400).send({ error: 'bad_request', message: 'Заполните имя, телефон и способ получения' })
        return
      }
      if (body.delivery === 'courier' && !body.address) {
        reply.code(400).send({ error: 'bad_request', message: 'Укажите адрес доставки' })
        return
      }

      // Серверный пересчёт сумм по актуальным ценам (фронту не доверяем)
      const items: OrderItem[] = []
      for (const line of body.items) {
        const product = await source.getProductById(line.productId)
        if (!product || !product.inStock) continue
        const qty = Math.max(1, Math.floor(line.qty))
        items.push({ productId: product.id, title: product.title, price: product.price, qty })
      }
      if (!items.length) {
        reply.code(400).send({ error: 'bad_request', message: 'Товары недоступны' })
        return
      }

      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
      const order: Order = {
        id: crypto.randomUUID(),
        userId: req.appUser!.id,
        createdAt: Date.now(),
        items,
        total,
        name: body.name,
        phone: body.phone,
        delivery: body.delivery,
        address: body.address ?? 'Самовывоз',
        comment: body.comment,
        status: 'new',
      }
      store.addOrder(order)
      reply.code(201)
      return { order }
    })
  }
}
