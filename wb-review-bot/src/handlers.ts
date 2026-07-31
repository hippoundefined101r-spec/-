import type { Env, TgMessage, TgUpdate } from './types';
import { answerCallbackQuery, deleteMessage, sendMessage, sendPhoto } from './telegram';
import { encryptSecret } from './crypto';
import { looksLikeWbToken, validateWbToken } from './wb';

const TRIAL_DAYS = 7;

// URL скриншота «где создать токен в кабинете WB». Пока плейсхолдер не загружен —
// пустая строка, бот отправит только текстовую инструкцию.
const INSTRUCTION_IMAGE_URL = '';

const START_TEXT = [
  'Отвечаю на отзывы Wildberries за вас: нахожу новые, пишу ответ в тоне вашего бренда, вы жмёте одну кнопку.',
  'Хорошие отзывы можно поставить на полный автомат — негатив всегда останется под вашим контролем.',
  `Подключение за 2 минуты, первые ${TRIAL_DAYS} дней бесплатно.`,
].join('\n\n');

const TOKEN_INSTRUCTION = [
  '<b>Как подключить магазин — 3 шага:</b>',
  '',
  '1️⃣ Зайдите в личный кабинет WB Партнёры → <b>Настройки → Доступ к API</b>',
  '2️⃣ Нажмите «Создать токен» и выберите категорию <b>только «Отзывы и вопросы»</b>',
  '3️⃣ Скопируйте токен и пришлите его сюда одним сообщением',
  '',
  '🔒 Почему только эта категория: такой токен не даёт доступа к ценам, поставкам и финансам — ' +
    'бот физически не сможет сделать ничего, кроме работы с отзывами. ' +
    'Токен хранится в зашифрованном виде, а ваше сообщение с ним я сразу удалю из чата.',
].join('\n');

export async function handleUpdate(update: TgUpdate, env: Env): Promise<void> {
  if (update.message?.text) {
    await handleMessage(update.message, env);
  } else if (update.callback_query) {
    await handleCallback(update, env);
  }
}

async function handleMessage(msg: TgMessage, env: Env): Promise<void> {
  const from = msg.from;
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

  // Приём токена: либо мы его явно ждём, либо сообщение выглядит как WB-токен (JWT).
  const state = await getOnboardingState(env, from.id);
  if (state === 'awaiting_token' || looksLikeWbToken(text)) {
    await handleTokenMessage(msg, text, env);
    return;
  }

  await sendMessage(env, {
    chat_id: msg.chat.id,
    text: 'Начните с /start, чтобы подключить магазин Wildberries.',
  });
}

async function handleTokenMessage(msg: TgMessage, token: string, env: Env): Promise<void> {
  const userId = msg.from!.id;
  const chatId = msg.chat.id;

  // Токен не должен оставаться в переписке — удаляем сразу, до валидации.
  await deleteMessage(env, chatId, msg.message_id);

  // Валидация входных данных до любых внешних запросов.
  if (!looksLikeWbToken(token)) {
    await sendMessage(env, {
      chat_id: chatId,
      text: '⚠️ Это не похоже на токен WB API. Токен — длинная строка из трёх частей, разделённых точками. Проверьте и пришлите ещё раз.',
    });
    return;
  }

  const check = await validateWbToken(token);

  if (!check.ok) {
    const errors: Record<typeof check.reason, string> = {
      unauthorized:
        '❌ WB не принял токен. Проверьте, что скопировали его целиком, и что он не отозван (токены живут 180 дней).',
      wrong_scope:
        '❌ Токен другой категории. Создайте токен именно с категорией «Отзывы и вопросы» — другие боту не подходят.',
      unavailable:
        '⏳ WB API сейчас недоступен, попробуйте прислать токен ещё раз через пару минут.',
    };
    await sendMessage(env, { chat_id: chatId, text: errors[check.reason] });
    return;
  }

  const encrypted = await encryptSecret(env, token);
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO shops (user_id, wb_token_encrypted, shop_name, is_active)
       VALUES (?1, ?2, ?3, 1)
       ON CONFLICT(user_id) DO UPDATE SET
         wb_token_encrypted = excluded.wb_token_encrypted,
         shop_name = excluded.shop_name,
         is_active = 1`
    ).bind(userId, encrypted, check.shopName),
    env.DB.prepare('UPDATE users SET onboarding_state = NULL WHERE telegram_id = ?1').bind(userId),
  ]);

  const shopLabel = check.shopName ? `: <b>${escapeHtml(check.shopName)}</b>` : '';
  await sendMessage(env, {
    chat_id: chatId,
    text: `✅ Подключено, магазин${shopLabel}\n\nСообщение с токеном удалено из чата. Каждые 10 минут я проверяю новые отзывы — как только появится неотвеченный, пришлю карточку с готовым ответом.`,
    parse_mode: 'HTML',
  });
}

async function handleCallback(update: TgUpdate, env: Env): Promise<void> {
  const cb = update.callback_query!;

  if (cb.data === 'connect_shop' && cb.message) {
    await answerCallbackQuery(env, cb.id);
    await upsertUser(env, cb.from.id);
    await env.DB.prepare(
      "UPDATE users SET onboarding_state = 'awaiting_token' WHERE telegram_id = ?1"
    )
      .bind(cb.from.id)
      .run();

    if (INSTRUCTION_IMAGE_URL) {
      await sendPhoto(env, cb.message.chat.id, INSTRUCTION_IMAGE_URL, TOKEN_INSTRUCTION);
    } else {
      await sendMessage(env, {
        chat_id: cb.message.chat.id,
        text: TOKEN_INSTRUCTION,
        parse_mode: 'HTML',
      });
    }
    return;
  }

  await answerCallbackQuery(env, cb.id);
}

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

async function getOnboardingState(env: Env, telegramId: number): Promise<string | null> {
  const row = await env.DB.prepare('SELECT onboarding_state FROM users WHERE telegram_id = ?1')
    .bind(telegramId)
    .first<{ onboarding_state: string | null }>();
  return row?.onboarding_state ?? null;
}

function escapeHtml(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
