import type { Env, TgSendMessageParams } from './types';

// Тонкий клиент Telegram Bot API поверх fetch.
// Осознанно без grammY: боту нужно ~6 методов, вебхук-режим на Workers,
// а прямые вызовы не добавляют зависимостей и holодного старта.

async function callApi<T>(env: Env, method: string, params: object): Promise<T | null> {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });

  const body = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!body.ok) {
    // В логи не попадают ни токены, ни тексты сообщений — только метод и код ошибки.
    console.error(`telegram ${method} failed: ${res.status} ${body.description ?? ''}`);
    return null;
  }
  return body.result ?? null;
}

export function sendMessage(env: Env, params: TgSendMessageParams) {
  return callApi(env, 'sendMessage', params);
}

export function deleteMessage(env: Env, chatId: number, messageId: number) {
  return callApi(env, 'deleteMessage', { chat_id: chatId, message_id: messageId });
}

export function answerCallbackQuery(env: Env, callbackQueryId: string, text?: string) {
  return callApi(env, 'answerCallbackQuery', { callback_query_id: callbackQueryId, text });
}

export function sendPhoto(env: Env, chatId: number, photoUrl: string, caption: string) {
  return callApi(env, 'sendPhoto', {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: 'HTML',
  });
}
