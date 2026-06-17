# КИРГУ — Telegram Mini App

Полноценный интернет-магазин сети **КИРГУ** (kirgu.ru) внутри Telegram:
мебель, техника, товары для дома и детей. Доставка по Дагестану и Чечне.

📋 Архитектура и принятые решения — в **[SPEC.md](./SPEC.md)**.

## Что внутри

```
/            frontend — Telegram Mini App (React + Vite)
server/      backend  — REST API (Fastify) поверх адаптера каталога
```

- **Frontend** — React 18 + TypeScript + Vite + Telegram Web App SDK.
  Строго фирменный стиль (зелёный `#0AA64B`, гротеск Gilroy/Manrope, белый фон).
- **Backend** — Node.js + TypeScript + Fastify. Ключевой элемент — интерфейс
  **`CatalogSource`**: сегодня работает `MockCatalogSource` (демо-данные),
  на этапе 2 подключается `BitrixCatalogSource` без изменений в роутерах и фронте.

## Возможности

- 🛍 Каталог: категории (Мебель / Техника / Товары для дома и детей), поиск, фильтры, сортировка
- 🚪 **Покупки по комнатам** (Гостиная, Спальня, Кухня, Детская, …) — как на сайте
- 🏷 **Акции и скидки** — отдельный раздел и лента на главной
- 📦 Карточка товара: характеристики, скидки, похожие товары
- 🛒 Корзина и оформление заявки: курьерская доставка (Дагестан/Чечня) или самовывоз
- 🔗 **Связка аккаунта КИРГУ** через Telegram-контакт (`requestContact`) — без SMS
- ❤️ Избранное, 👤 профиль, история заказов
- 🔐 Проверка `initData` Telegram на бэкенде (HMAC-SHA256)

> Онлайн-оплаты в MVP нет: заказ — это заявка, менеджер перезванивает (см. SPEC, этап 3).

## Запуск

### Frontend (Mini App)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # продакшен-сборка в dist/
```

По умолчанию фронт работает на локальных демо-данных. Чтобы ходить в backend,
задайте `VITE_API_BASE` (например `http://localhost:8787/api`).

### Backend (API)

```bash
cd server
npm install
cp .env.example .env        # при необходимости задайте BOT_TOKEN, CATALOG_SOURCE и т.д.
npm run dev                 # http://localhost:8787  (tsx watch)
npm run build && npm start  # продакшен
```

Проверка: `curl localhost:8787/health` → `{ "status": "ok", "catalogSource": "mock", ... }`

Основные эндпоинты (префикс `/api`): `catalog/categories`, `catalog/rooms`,
`catalog/products`, `catalog/products/:id`, `stocks`, `auth/telegram`,
`auth/link-contact`, `orders`. Полный контракт — в [SPEC.md](./SPEC.md).

## Подключение к Telegram

1. Соберите фронт (`npm run build`) и задеплойте `dist/` на HTTPS-хостинг.
2. Поднимите backend на HTTPS, задайте `BOT_TOKEN` и `CORS_ORIGIN` (домен Mini App).
3. В [@BotFather](https://t.me/BotFather) через `/newapp` (или `/setmenubutton`)
   укажите URL вашего Mini App.

## Структура

```
src/
├── api/         api-клиент бэкенда (контракт совпадает с server/)
├── components/  ProductCard, BottomNav, BackLink, EmptyState
├── data/        демо-данные: products, categories, rooms, stocks
├── pages/       Catalog, Rooms, Room, Stocks, Product, Cart, Checkout, …
├── store/       zustand (корзина, избранное, заказы)
├── telegram.ts  обёртка над Telegram Web App SDK (+ requestContact)
└── styles.css   фирменные стили
server/
└── src/
    ├── catalog/  CatalogSource + Mock/Bitrix адаптеры + фабрика
    ├── routes/   catalog, auth, orders
    ├── telegram/ проверка initData / нормализация телефона
    └── data/     демо-данные источника
```

## Дальнейшие шаги

См. дорожную карту в [SPEC.md](./SPEC.md) — реализация `BitrixCatalogSource`,
перевод фронта полностью на API, онлайн-оплата, бонусная программа, пуши о статусе.
