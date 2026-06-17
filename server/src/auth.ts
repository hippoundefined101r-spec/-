import type { FastifyReply, FastifyRequest } from 'fastify'
import { verifyInitData } from './telegram/verify.js'
import { store } from './store.js'
import type { AppUser } from './types.js'

declare module 'fastify' {
  interface FastifyRequest {
    appUser?: AppUser
  }
}

/**
 * preHandler-гард: извлекает initData из заголовка `Authorization: tma <initDataRaw>`,
 * проверяет подпись и кладёт пользователя в request.appUser.
 */
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const header = req.headers.authorization ?? ''
  const raw = header.startsWith('tma ') ? header.slice(4) : ''
  const verified = verifyInitData(raw)
  if (!verified) {
    reply.code(401).send({ error: 'unauthorized', message: 'Невалидный или отсутствующий initData' })
    return
  }
  req.appUser = store.upsertUser(verified.user)
}
