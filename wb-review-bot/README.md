# WB Review Bot

Telegram-бот, автоматизирующий ответы на отзывы Wildberries для продавцов.
Стек: Cloudflare Workers (TypeScript) + D1 (SQLite) + Anthropic API (`claude-haiku-4-5`) + Telegram Bot API напрямую через fetch.

## Структура

```
wb-review-bot/
├── wrangler.toml          # конфиг Worker'а: D1, cron */10, без секретов
├── migrations/
│   └── 0001_init.sql      # схема: users, shops, settings, feedbacks, payments
└── src/
    ├── index.ts           # вебхук Telegram (POST /webhook) + cron-заглушка
    ├── handlers.ts        # роутинг апдейтов, /start, кнопка «Подключить магазин»
    ├── telegram.ts        # тонкий клиент Bot API (fetch, без фреймворков)
    └── types.ts           # Env и минимальные типы Telegram
```

## Деплой с нуля

Требуется аккаунт Cloudflare (бесплатного тарифа хватает: Workers Free + D1 Free) и Node.js 18+.

### 1. Создать бота в Telegram

1. Написать [@BotFather](https://t.me/BotFather) → `/newbot` → получить `TELEGRAM_BOT_TOKEN`.
2. Токен никуда не записывать, кроме секретов (шаг 4).

### 2. Установить зависимости и создать D1

```bash
cd wb-review-bot
npm install
npx wrangler login                      # авторизация в Cloudflare
npx wrangler d1 create wb_review_bot    # выведет database_id
```

Скопировать `database_id` из вывода в `wrangler.toml` (поле `database_id` в блоке `[[d1_databases]]`).

### 3. Применить миграции

```bash
npm run db:migrate:remote     # продакшен-база
npm run db:migrate:local      # локальная база для wrangler dev
```

### 4. Задать секреты (Cloudflare Secrets)

```bash
# Токен бота от BotFather
npx wrangler secret put TELEGRAM_BOT_TOKEN

# Секрет вебхука — любая случайная строка (сгенерировать)
openssl rand -hex 32
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET

# Ключ шифрования WB-токенов: РОВНО 32 байта в base64 (AES-256-GCM)
openssl rand -base64 32
npx wrangler secret put ENCRYPTION_KEY

# Ключ Anthropic (понадобится с этапа 4, задать можно сразу)
npx wrangler secret put ANTHROPIC_API_KEY
```

> ⚠️ **Обязательно**: в консоли Anthropic (Settings → Limits) выставить месячный лимит расходов на этот ключ — защита от слива бюджета.

### 5. Задеплоить Worker

```bash
npm run deploy
# в выводе будет URL вида https://wb-review-bot.<account>.workers.dev
```

### 6. Привязать вебхук Telegram

`SECRET` — то же значение, что в `TELEGRAM_WEBHOOK_SECRET`:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://wb-review-bot.<account>.workers.dev/webhook" \
  -d "secret_token=<SECRET>" \
  -d "allowed_updates=[\"message\",\"callback_query\",\"pre_checkout_query\"]"
```

Проверка: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"` — поле `url` должно указывать на Worker, `last_error_message` — отсутствовать.

### 7. Проверить

Написать боту `/start` — придёт приветствие с кнопкой «Подключить магазин».

## Локальная разработка

```bash
cp .dev.vars.example .dev.vars   # заполнить значениями
npm run dev                      # wrangler dev на localhost
```

Для проверки вебхука локально нужен туннель (например `cloudflared tunnel --url http://localhost:8787`).

## Безопасность (инварианты проекта)

- WB-токены — только зашифрованными (AES-GCM) в D1; ключ — в Workers Secrets.
- Секреты не попадают в код, git и логи. В логах нет ни токенов, ни текстов отзывов.
- Вебхук принимает запросы только с верным `X-Telegram-Bot-Api-Secret-Token`.
- Каждый запрос к БД фильтруется по `telegram_id` владельца.
