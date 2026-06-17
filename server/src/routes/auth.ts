import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../auth.js'
import { normalizePhone } from '../telegram/verify.js'
import { findBitrixUserByPhone, store } from '../store.js'

export async function authRoutes(app: FastifyInstance) {
  // Проверка initData и возврат текущего пользователя
  app.post('/auth/telegram', { preHandler: requireAuth }, async (req) => {
    return { user: req.appUser }
  })

  // Связка телефона (из Telegram requestContact) с профилем Bitrix
  app.post('/auth/link-contact', { preHandler: requireAuth }, async (req, reply) => {
    const body = (req.body ?? {}) as { phone?: string }
    if (!body.phone) {
      reply.code(400).send({ error: 'bad_request', message: 'phone обязателен' })
      return
    }
    const phone = normalizePhone(body.phone)
    const bitrixUserId = await findBitrixUserByPhone(phone)
    const user = store.linkPhone(req.appUser!.id, phone, bitrixUserId)
    return { user, linked: Boolean(bitrixUserId) }
  })
}
