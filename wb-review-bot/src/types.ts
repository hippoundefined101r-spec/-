// Окружение Worker'а. Секреты — только через Cloudflare Secrets (wrangler secret put).
export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  ENCRYPTION_KEY: string; // base64, 32 байта — AES-GCM ключ для WB-токенов (этап 2)
  ANTHROPIC_API_KEY: string; // генерация ответов (этап 4)
}

// Минимальные типы Telegram Bot API — только то, что реально используем.
// Полные типы фреймворков не тянем: бот работает на нескольких методах.
export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
  callback_query?: TgCallbackQuery;
}

export interface TgMessage {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  text?: string;
}

export interface TgUser {
  id: number;
  first_name: string;
  username?: string;
}

export interface TgChat {
  id: number;
  type: string;
}

export interface TgCallbackQuery {
  id: string;
  from: TgUser;
  message?: TgMessage;
  data?: string;
}

export interface TgInlineKeyboardButton {
  text: string;
  callback_data: string;
}

export interface TgSendMessageParams {
  chat_id: number;
  text: string;
  parse_mode?: 'HTML';
  reply_markup?: { inline_keyboard: TgInlineKeyboardButton[][] };
}
