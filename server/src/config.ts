// Конфигурация из переменных окружения. Без внешних зависимостей —
// .env подхватывается через `node --env-file` (Node 20+) или окружением хостинга.

function env(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

export const config = {
  port: Number(env('PORT', '8787')),
  botToken: env('BOT_TOKEN'),
  catalogSource: env('CATALOG_SOURCE', 'mock') as 'mock' | 'bitrix',
  bitrixBaseUrl: env('BITRIX_BASE_URL'),
  bitrixWebhookToken: env('BITRIX_WEBHOOK_TOKEN'),
  corsOrigin: env('CORS_ORIGIN', '*'),
  /** Максимальный возраст initData в секундах (защита от replay) */
  initDataMaxAgeSec: 24 * 60 * 60,
  /** Мягкий режим проверки initData, если BOT_TOKEN не задан (для локальной разработки) */
  get devAuthBypass() {
    return this.botToken === ''
  },
}
