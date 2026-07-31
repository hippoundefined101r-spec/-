-- Миграция 0001: базовая схема
-- Все запросы в коде обязаны фильтровать по telegram_id владельца (изоляция пользователей).

-- Пользователи бота. PK = telegram_id (уникален на стороне Telegram).
CREATE TABLE users (
    telegram_id             INTEGER PRIMARY KEY,
    created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
    -- Триал: 7 дней ИЛИ 25 ответов (answers_used), что наступит раньше
    trial_ends_at           TEXT    NOT NULL,
    -- trial | active | expired
    subscription_status     TEXT    NOT NULL DEFAULT 'trial'
                            CHECK (subscription_status IN ('trial', 'active', 'expired')),
    subscription_expires_at TEXT,
    answers_used            INTEGER NOT NULL DEFAULT 0
);

-- Подключённые магазины WB. Токен хранится ТОЛЬКО зашифрованным (AES-GCM).
-- В MVP — один магазин на пользователя (UNIQUE user_id).
CREATE TABLE shops (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id            INTEGER NOT NULL UNIQUE REFERENCES users(telegram_id),
    wb_token_encrypted TEXT    NOT NULL,
    shop_name          TEXT    NOT NULL DEFAULT '',
    is_active          INTEGER NOT NULL DEFAULT 1,
    created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Настройки продавца (тон, бренд, подпись, автопилот, запрещённые слова).
CREATE TABLE settings (
    user_id      INTEGER PRIMARY KEY REFERENCES users(telegram_id),
    -- business | friendly | warm
    tone         TEXT    NOT NULL DEFAULT 'friendly'
                 CHECK (tone IN ('business', 'friendly', 'warm')),
    brand_name   TEXT    NOT NULL DEFAULT '',
    signature    TEXT    NOT NULL DEFAULT '',
    autopilot    INTEGER NOT NULL DEFAULT 0,
    -- JSON-массив строк, например: ["слово1","слово2"]
    banned_words TEXT    NOT NULL DEFAULT '[]'
);

-- Обработанные отзывы. wb_feedback_id UNIQUE — дедупликация «один отзыв — один раз».
CREATE TABLE feedbacks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    wb_feedback_id  TEXT    NOT NULL UNIQUE,
    user_id         INTEGER NOT NULL REFERENCES users(telegram_id),
    product_name    TEXT    NOT NULL DEFAULT '',
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text            TEXT    NOT NULL DEFAULT '',
    generated_reply TEXT,
    -- pending: карточка у продавца; sent: ответ отправлен в WB; skipped: пропущен; error: ошибка отправки
    status          TEXT    NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sent', 'skipped', 'error')),
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    sent_at         TEXT
);

CREATE INDEX idx_feedbacks_user_status ON feedbacks(user_id, status);

-- Платежи Telegram Stars.
CREATE TABLE payments (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL REFERENCES users(telegram_id),
    telegram_payment_id TEXT    NOT NULL UNIQUE,
    amount              INTEGER NOT NULL,
    -- период подписки, например 'month'
    period              TEXT    NOT NULL DEFAULT 'month',
    created_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_payments_user ON payments(user_id);
