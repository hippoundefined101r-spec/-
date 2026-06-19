import { BRAND_NAME, ADDRESS, PHONE, PHONE_HREF, WORK_HOURS } from '../config'
import { advantages } from '../data/promos'

export function AboutPage() {
  return (
    <>
      <h1 className="page-title">О компании {BRAND_NAME}</h1>
      <p className="lead">
        {BRAND_NAME} — магазин смартфонов и техники в Махачкале. Продаём только оригинальную
        технику, помогаем с выбором и настройкой, оформляем рассрочку и трейд-ин. Работаем честно
        и по-серьёзному: за каждый товар отвечаем гарантией и сервисом.
      </p>

      <section className="section">
        <div className="adv-grid">
          {advantages.map((a) => (
            <div className="adv" key={a.title}>
              <div className="adv__icon">{a.icon}</div>
              <div className="adv__title">{a.title}</div>
              <div className="adv__text">{a.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Гарантия и сервис</h2>
        </div>
        <div className="specs">
          <div className="specs__row">
            <span className="specs__label">Гарантия</span>
            <span>12 месяцев на всю технику</span>
          </div>
          <div className="specs__row">
            <span className="specs__label">Сервисный центр</span>
            <span>Собственный, диагностика бесплатно</span>
          </div>
          <div className="specs__row">
            <span className="specs__label">Обмен и возврат</span>
            <span>14 дней по закону</span>
          </div>
          <div className="specs__row">
            <span className="specs__label">Проверка при покупке</span>
            <span>Тестируем устройство при вас</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Контакты</h2>
        </div>
        <div className="panel">
          <div className="footer__contact">
            <a href={PHONE_HREF}>{PHONE}</a>
            <br />
            {ADDRESS}
            <br />
            {WORK_HOURS}
          </div>
          <div className="footer__map" style={{ marginTop: 14 }}>
            <div className="footer__map-pin">
              <span style={{ fontSize: 22 }}>📍</span>
              <span>Карта проезда (2ГИС)</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
