import type { Env, TgUpdate } from './types';
import { handleUpdate } from './handlers';

export default {
  // Вебхук Telegram. Единственный публичный маршрут: POST /webhook.
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== 'POST' || url.pathname !== '/webhook') {
      return new Response('Not found', { status: 404 });
    }

    // Защита вебхука: Telegram присылает secret_token, заданный при setWebhook.
    const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (!secret || secret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }

    let update: TgUpdate;
    try {
      update = await request.json<TgUpdate>();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    // Отвечаем Telegram сразу, обработку доводим в фоне —
    // иначе Telegram ретраит апдейт при медленном ответе.
    ctx.waitUntil(
      handleUpdate(update, env).catch((err) => {
        // Логируем только тип ошибки, без содержимого апдейта.
        console.error('update handling failed:', err instanceof Error ? err.message : 'unknown');
      })
    );

    return new Response('ok');
  },

  // Cron */10: опрос неотвеченных отзывов WB. Логика — этап 3.
  async scheduled(_controller: ScheduledController, _env: Env, _ctx: ExecutionContext): Promise<void> {
    console.log('cron tick: feedback polling not implemented yet (stage 3)');
  },
} satisfies ExportedHandler<Env>;
