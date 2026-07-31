import type { Env, TgUpdate } from './types';
import { answerCallbackQuery, sendMessage } from './telegram';

const TRIAL_DAYS = 7;

const START_TEXT = [
  'Отвечаю на отзывы Wildberries за вас: нахожу новые, пишу ответ в тоне вашего бренда, вы жмёте одну кнопку.',
  'Хорошие отзывы можно поставить на полный автомат — негатив всегда останется под вашим контролем.',
  `Подключение за 2 минуты, первые ${TRIAL_DAYS} дней бесплатно.`,
].join('\n\n');

export async function handleUpdate(update: TgUpdate, env: Env): Promise<void> {
  if (update.message?.text) {
    await handleMessage(update, env);
  } else if (update.callback_query) {
    await handleCallback(update, env);
  }
  // Остальные типы апдейтов на этапе 1 игнорируем.
}

async function handleMessage(update: TgUpdate, env: Env): Promise<void> {
  const msg = update.message!;
  const from = msg.from;
  // Работаем только в личке и только с валидным отправителем.
  if (!from || msg.chat.type !== 'private') return;

  const text = (msg.text ?? '').trim();

  if (text === '/start') {
    await upsertUser(env, from.id);
    await sendMessage(env, {
      chat_id: msg.chat.id,
      text: START_TEXT,
      reply_markup: {
        inline_keyboard: [[{ text: '🔌 Подключить магазин', callback_data: 'connect_shop' }]],
      },
    });
    return;
  }

  // Незнакомые команды/текст — короткая подсказка (онбординг токена появится на этапе 2).
  await sendMessage(env, {
    chat_id: msg.chat.id,
    text: 'Начните с /start, чтобы подключить магазин Wildberries.',
  });
}

async function handleCallback(update: TgUpdate, env: Env): Promise<void> {
  const cb = update.callback_query!;

  if (cb.data === 'connect_shop') {
    await answerCallbackQuery(env, cb.id);
    if (cb.message) {
      await sendMessage(env, {
        chat_id: cb.message.chat.id,
        text: 'Подключение магазина появится на следующем шаге разработки (этап 2: токен WB, шифрование, проверка).',
      });
    }
    return;
  }

  // Неизвестный callback — просто гасим «часики».
  await answerCallbackQuery(env, cb.id);
}

// Создаёт пользователя с триалом на 7 дней; повторный /start ничего не перезаписывает.
async function upsertUser(env: Env, telegramId: number): Promise<void> {
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO users (telegram_id, trial_ends_at) VALUES (?1, ?2) ON CONFLICT(telegram_id) DO NOTHING'
    ).bind(telegramId, trialEndsAt),
    env.DB.prepare(
      'INSERT INTO settings (user_id) VALUES (?1) ON CONFLICT(user_id) DO NOTHING'
    ).bind(telegramId),
  ]);
}
