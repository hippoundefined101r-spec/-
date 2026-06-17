# ТЕХНОКЫРГЫЗ — Telegram Mini App

Telegram Mini App для магазина электроники и бытовой техники (Кыргызстан).
Frontend-MVP на тестовых данных (моках), без реального бэкенда.

## Стек

- **React 18 + TypeScript + Vite**
- **react-router-dom** (HashRouter — работает без серверных rewrite-ов)
- **zustand** + `persist` — состояние корзины/избранного/заказов сохраняется в `localStorage`
- **Telegram Web App SDK** — подключён через `<script>` в `index.html`, цвета берутся из темы Telegram

## Возможности

- 🛍 Каталог с категориями, поиском и фильтрацией по бренду/названию
- 📦 Карточка товара: характеристики, скидки, похожие товары
- 🛒 Корзина: изменение количества, удаление, подсчёт суммы
- 📝 Оформление заказа: доставка/самовывоз, оплата наличными/картой, валидация формы
- ❤️ Избранное
- 👤 Профиль (данные пользователя Telegram) + история заказов
- 📱 Адаптация под тему Telegram (светлая/тёмная) и хаптика

## Запуск

```bash
npm install
npm run dev      # дев-сервер на http://localhost:5173
npm run build    # продакшен-сборка в dist/
npm run preview  # предпросмотр сборки
```

## Подключение к Telegram

1. Соберите проект (`npm run build`) и задеплойте `dist/` на HTTPS-хостинг
   (Vercel, Netlify, GitHub Pages и т.п.).
2. В [@BotFather](https://t.me/BotFather) создайте бота и через `/newapp`
   (или `/setmenubutton`) укажите URL вашего Mini App.
3. Откройте бота в Telegram — приложение запустится внутри мессенджера.

## Структура

```
src/
├── components/   # ProductCard, BottomNav, BackLink, EmptyState
├── data/         # моки: products.ts, categories.ts
├── pages/        # Catalog, Product, Cart, Checkout, OrderSuccess, Favorites, Profile, Orders
├── store/        # zustand-стор (корзина, избранное, заказы)
├── utils/        # форматирование цены/дат
├── telegram.ts   # обёртка над Telegram Web App SDK
└── styles.css    # глобальные стили + переменные темы
```

## Дальнейшие шаги (вне текущего MVP)

- Реальный бэкенд/API для товаров и заказов
- Авторизация по `initData` Telegram (проверка подписи на сервере)
- Онлайн-оплата (Telegram Payments / местные платёжные системы KGS)
- Админка для управления каталогом
