import crypto from 'node:crypto'
import { config } from '../config.js'
import type { AppUser } from '../types.js'

export interface VerifiedInitData {
  user: AppUser
  authDate: number
  raw: string
}

/**
 * Проверка Telegram WebApp initData по официальной схеме:
 *   secretKey = HMAC_SHA256("WebAppData", BOT_TOKEN)
 *   hash      = HMAC_SHA256(dataCheckString, secretKey)
 * где dataCheckString — пары key=value (кроме hash), отсортированные по ключу и склеенные "\n".
 *
 * В dev-режиме (BOT_TOKEN не задан) подпись не проверяется, но данные парсятся —
 * чтобы можно было разрабатывать без бота.
 */
export function verifyInitData(initDataRaw: string): VerifiedInitData | null {
  if (!initDataRaw) return null

  const params = new URLSearchParams(initDataRaw)
  const hash = params.get('hash')
  const authDate = Number(params.get('auth_date') ?? '0')

  const userJson = params.get('user')
  if (!userJson) return null

  let parsedUser: Record<string, unknown>
  try {
    parsedUser = JSON.parse(userJson)
  } catch {
    return null
  }

  const user: AppUser = {
    id: Number(parsedUser.id),
    firstName: String(parsedUser.first_name ?? ''),
    lastName: parsedUser.last_name ? String(parsedUser.last_name) : undefined,
    username: parsedUser.username ? String(parsedUser.username) : undefined,
  }
  if (!user.id) return null

  if (config.devAuthBypass) {
    return { user, authDate, raw: initDataRaw }
  }

  if (!hash) return null

  // Свежесть
  const ageSec = Math.floor(Date.now() / 1000) - authDate
  if (authDate === 0 || ageSec > config.initDataMaxAgeSec) return null

  const dataCheckString = [...params.entries()]
    .filter(([k]) => k !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(config.botToken).digest()
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  // Сравнение в постоянном времени
  if (!timingSafeEqualHex(computed, hash)) return null

  return { user, authDate, raw: initDataRaw }
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
  } catch {
    return false
  }
}

/**
 * Верификация контакта, полученного из Telegram `requestContact`.
 * Telegram возвращает телефон как часть подписанных данных WebApp, поэтому
 * сам факт прихода контакта от того же user_id считаем достаточным.
 * Дополнительно нормализуем номер.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // РФ: приводим 8XXXXXXXXXX к 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('8')) return '7' + digits.slice(1)
  return digits
}
