import { Link } from 'react-router-dom'
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  ADDRESS,
  PHONE,
  PHONE_HREF,
  WORK_HOURS,
  SOCIAL,
} from '../config'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="logo" style={{ marginBottom: 10 }}>
              <span className="logo__mark">📱</span>
              <span className="logo__name">{BRAND_NAME}</span>
            </div>
            <p className="footer__contact">{BRAND_TAGLINE}</p>
            <div className="footer__social">
              <a href={SOCIAL.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                💬
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
                ✈️
              </a>
              <a href={SOCIAL.twogis} target="_blank" rel="noreferrer" aria-label="2ГИС">
                🗺️
              </a>
              <a href={SOCIAL.instagram} aria-label="Instagram">
                📷
              </a>
            </div>
          </div>

          <div>
            <h4>Покупателям</h4>
            <div className="footer__links">
              <Link to="/catalog">Каталог</Link>
              <Link to="/trade-in">Трейд-ин (обмен)</Link>
              <Link to="/promo">Акции и скидки</Link>
              <Link to="/compare">Сравнение</Link>
              <Link to="/about">Гарантия и сервис</Link>
              <Link to="/blog">Блог</Link>
            </div>
          </div>

          <div>
            <h4>Контакты</h4>
            <div className="footer__contact">
              <a href={PHONE_HREF}>{PHONE}</a>
              <br />
              {ADDRESS}
              <br />
              {WORK_HOURS}
            </div>
            <div className="footer__map">
              <div className="footer__map-pin">
                <span style={{ fontSize: 22 }}>📍</span>
                <span>Карта проезда (2ГИС)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__copy">
          © {new Date().getFullYear()} {BRAND_NAME}. Демо-макет. Цены и наличие — для
          демонстрации. Не является публичной офертой.
        </div>
      </div>
    </footer>
  )
}
