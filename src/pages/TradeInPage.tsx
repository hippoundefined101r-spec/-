import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/format'

const MODELS: Record<string, number> = {
  'iPhone 14 Pro': 62000,
  'iPhone 13': 38000,
  'iPhone 12': 27000,
  'Samsung Galaxy S23': 34000,
  'Xiaomi 13': 22000,
  Другой: 12000,
}

const CONDITIONS = [
  { id: 'excellent', label: 'Отличное', factor: 1 },
  { id: 'good', label: 'Хорошее', factor: 0.8 },
  { id: 'fair', label: 'С дефектами', factor: 0.55 },
]

export function TradeInPage() {
  const [model, setModel] = useState('iPhone 13')
  const [condition, setCondition] = useState('good')
  const [done, setDone] = useState(false)

  const base = MODELS[model]
  const factor = CONDITIONS.find((c) => c.id === condition)!.factor
  const estimate = Math.round((base * factor) / 1000) * 1000

  return (
    <>
      <h1 className="page-title">Трейд-ин: обмен с доплатой</h1>
      <p className="lead" style={{ marginBottom: 20 }}>
        Сдайте старый смартфон и получите скидку на новый. Оценка за 10 минут, без скрытых
        условий — доплачиваете только разницу.
      </p>

      <div className="grid-2">
        <div className="panel">
          <div className="filter-block">
            <div className="filter-block__title">Ваш текущий смартфон</div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 14px',
                color: 'var(--text)',
                font: 'inherit',
              }}
            >
              {Object.keys(MODELS).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <div className="filter-block__title">Состояние</div>
            <div className="radio-group radio-group--3">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  className={`radio ${condition === c.id ? 'active' : ''}`}
                  onClick={() => setCondition(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="panel"
          key={estimate}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'var(--grad)', border: 'none' }}
        >
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 14 }}>Оценка вашего телефона</div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', margin: '6px 0' }}>
            до {formatPrice(estimate)}
          </div>
          <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 14 }}>
            Эта сумма пойдёт в зачёт стоимости нового смартфона. Финальная цена — после осмотра.
          </p>
          {done ? (
            <div
              className="panel"
              style={{ marginTop: 14, background: 'rgba(0,0,0,.25)', border: 'none', color: '#fff' }}
            >
              ✅ Заявка отправлена! Перезвоним и согласуем время осмотра.
            </div>
          ) : (
            <button
              className="btn btn--lime btn--block"
              style={{ marginTop: 14 }}
              onClick={() => setDone(true)}
            >
              Записаться на оценку
            </button>
          )}
        </motion.div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Как это работает</h2>
        </div>
        <div className="grid-3">
          {[
            { n: '1', t: 'Оценка', d: 'Выбираете модель и состояние — узнаёте сумму онлайн' },
            { n: '2', t: 'Осмотр', d: 'Привозите телефон в магазин в Махачкале или вызываете курьера' },
            { n: '3', t: 'Доплата', d: 'Доплачиваете разницу и забираете новый смартфон' },
          ].map((s) => (
            <div className="panel" key={s.n}>
              <div className="logo__mark" style={{ marginBottom: 10 }}>{s.n}</div>
              <div style={{ fontWeight: 700 }}>{s.t}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 24 }}>
        <Link to="/catalog" className="btn btn--primary">
          Выбрать новый смартфон →
        </Link>
      </div>
    </>
  )
}
