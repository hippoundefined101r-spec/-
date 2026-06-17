// Автонастройка Telegram-бота под Mini App КИРГУ через Bot API.
// Запуск (токен НЕ коммитим — берётся из окружения):
//
//   BOT_TOKEN=123:abc node scripts/setup-bot.mjs
//   # необязательно переопределить URL:
//   BOT_TOKEN=123:abc MINIAPP_URL=https://example.com node scripts/setup-bot.mjs
//
// Что делает:
//   • проверяет токен (getMe)
//   • ставит кнопку-меню с Web App (Mini App)
//   • задаёт команды (/start, /help)
//   • задаёт имя, краткое и полное описание бота
//
// Требует Node 18+ (использует глобальный fetch). Зависимостей нет.

const BOT_TOKEN = process.env.BOT_TOKEN
const MINIAPP_URL = process.env.MINIAPP_URL || 'https://hippoundefined101r-spec.github.io/-/'
const MENU_TEXT = process.env.MENU_TEXT || 'Магазин КИРГУ'

if (!BOT_TOKEN) {
  console.error('✗ Не задан BOT_TOKEN. Пример: BOT_TOKEN=123:abc node scripts/setup-bot.mjs')
  process.exit(1)
}

const API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function call(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`${method}: ${data.description} (код ${data.error_code})`)
  return data.result
}

// Выполняет шаг, не прерывая весь скрипт при ошибке (например, флуд-лимит на имя/описание).
async function step(label, fn) {
  try {
    await fn()
    console.log(`✓ ${label}`)
  } catch (e) {
    console.warn(`! ${label} — пропущено: ${e.message}`)
  }
}

async function main() {
  const me = await call('getMe')
  console.log(`Бот: @${me.username} (${me.first_name}), id ${me.id}`)
  console.log(`Mini App URL: ${MINIAPP_URL}\n`)

  await step('Кнопка-меню с Mini App', () =>
    call('setChatMenuButton', {
      menu_button: { type: 'web_app', text: MENU_TEXT, web_app: { url: MINIAPP_URL } },
    }),
  )

  await step('Команды бота', () =>
    call('setMyCommands', {
      commands: [
        { command: 'start', description: 'Открыть магазин' },
        { command: 'help', description: 'Помощь и контакты' },
      ],
      language_code: 'ru',
    }),
  )

  await step('Имя бота', () => call('setMyName', { name: 'КИРГУ — магазин', language_code: 'ru' }))

  await step('Краткое описание', () =>
    call('setMyShortDescription', {
      short_description: 'Мебель, техника и товары для дома. Доставка по Дагестану и Чечне.',
      language_code: 'ru',
    }),
  )

  await step('Полное описание', () =>
    call('setMyDescription', {
      description:
        'Интернет-магазин КИРГУ прямо в Telegram: каталог мебели и техники, покупки по комнатам, ' +
        'акции, корзина и оформление заказа. Нажмите кнопку меню, чтобы открыть магазин.',
      language_code: 'ru',
    }),
  )

  console.log(`\nГотово. Откройте бота: https://t.me/${me.username}`)
  console.log('Внизу диалога появится кнопка меню — она запускает Mini App.')
}

main().catch((e) => {
  console.error(`\n✗ Ошибка: ${e.message}`)
  process.exit(1)
})
