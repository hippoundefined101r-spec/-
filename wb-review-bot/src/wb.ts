// Клиент WB API. Токен передаётся в заголовке Authorization (без 'Bearer').
// Эндпоинты (сверено с документацией, июль 2026):
//   GET  feedbacks-api.wildberries.ru/ping                  — валидность токена + категория «Отзывы и вопросы»
//   GET  common-api.wildberries.ru/api/v1/seller-info       — название магазина (любой валидный токен)
//   GET  feedbacks-api.wildberries.ru/api/v1/feedbacks      — список отзывов (этап 3)
//   POST feedbacks-api.wildberries.ru/api/v1/feedbacks/answer — ответ на отзыв (этап 4)

const FEEDBACKS_API = 'https://feedbacks-api.wildberries.ru';
const COMMON_API = 'https://common-api.wildberries.ru';
const TIMEOUT_MS = 10_000;

export type TokenValidation =
  | { ok: true; shopName: string }
  | { ok: false; reason: 'unauthorized' | 'wrong_scope' | 'unavailable' };

// WB-токен — это JWT: три base64url-сегмента через точку.
export function looksLikeWbToken(text: string): boolean {
  return (
    text.length > 100 &&
    text.length < 4000 &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(text)
  );
}

function wbFetch(url: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: token,
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

// Тестовый запрос: ping проверяет и подпись токена, и его категорию.
export async function validateWbToken(token: string): Promise<TokenValidation> {
  let pingStatus: number;
  try {
    const res = await wbFetch(`${FEEDBACKS_API}/ping`, token);
    pingStatus = res.status;
  } catch {
    return { ok: false, reason: 'unavailable' };
  }

  if (pingStatus === 401) return { ok: false, reason: 'unauthorized' };
  if (pingStatus === 403) return { ok: false, reason: 'wrong_scope' };
  if (pingStatus !== 200) return { ok: false, reason: 'unavailable' };

  return { ok: true, shopName: await fetchSellerName(token) };
}

// Название магазина — не критично: при ошибке возвращаем пустую строку.
async function fetchSellerName(token: string): Promise<string> {
  try {
    const res = await wbFetch(`${COMMON_API}/api/v1/seller-info`, token);
    if (!res.ok) return '';
    const info = (await res.json()) as { name?: string; tradeMark?: string };
    return (info.tradeMark || info.name || '').slice(0, 200);
  } catch {
    return '';
  }
}
