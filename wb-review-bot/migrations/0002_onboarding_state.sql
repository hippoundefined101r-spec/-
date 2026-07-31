-- Миграция 0002: состояние онбординга.
-- awaiting_token — бот ждёт от пользователя WB-токен; NULL — обычный режим.
ALTER TABLE users ADD COLUMN onboarding_state TEXT;
