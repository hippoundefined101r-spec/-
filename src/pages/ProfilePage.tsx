import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Heart, ShoppingCart, Phone, MapPin, Truck, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { getTelegramUser, requestContact, hapticSuccess, haptic } from '../telegram'
import { api } from '../api/client'

export function ProfilePage() {
  const navigate = useNavigate()
  const orders = useStore((s) => s.orders)
  const favorites = useStore((s) => s.favorites)
  const tgUser = getTelegramUser()

  const [linkState, setLinkState] = useState<'idle' | 'pending' | 'linked' | 'shared' | 'error'>(
    'idle',
  )

  const name = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
    : 'Гость'
  const initial = name.charAt(0).toUpperCase()

  async function linkAccount() {
    haptic('medium')
    setLinkState('pending')
    const shared = await requestContact()
    if (!shared) {
      setLinkState('idle')
      return
    }
    try {
      // Телефон Telegram передаёт боту/бэкенду в подписанных данных.
      // На бэкенде он сопоставляется с профилем Bitrix.
      const res = await api.linkContact('')
      hapticSuccess()
      setLinkState(res.linked ? 'linked' : 'shared')
    } catch {
      // Бэкенд недоступен (например, открыто в обычном браузере) — контакт всё равно получен.
      setLinkState('shared')
    }
  }

  return (
    <div className="page">
      <h2 style={{ marginTop: 4 }}>Профиль</h2>
      <div className="profile-head">
        <div className="avatar">{initial}</div>
        <div>
          <div className="profile-name">{name}</div>
          {tgUser?.username && <div className="profile-username">@{tgUser.username}</div>}
          {!tgUser && <div className="profile-username">Откройте через Telegram</div>}
        </div>
      </div>

      {/* Связка аккаунта КИРГУ */}
      <div className="link-card">
        {linkState === 'linked' ? (
          <div className="link-card__ok">
            <CheckCircle2 size={18} /> Аккаунт КИРГУ привязан — бонусы и история доступны
          </div>
        ) : linkState === 'shared' ? (
          <div className="link-card__ok">
            <CheckCircle2 size={18} /> Контакт получен. Профиль КИРГУ подтянется автоматически
          </div>
        ) : (
          <>
            <div className="link-card__title">Привяжите аккаунт КИРГУ</div>
            <div className="link-card__sub">
              Поделитесь номером телефона — подтянем бонусы и историю заказов
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 12 }}
              disabled={linkState === 'pending'}
              onClick={linkAccount}
            >
              {linkState === 'pending' ? 'Запрашиваем…' : 'Поделиться контактом'}
            </button>
          </>
        )}
      </div>

      <div className="menu">
        <button className="menu__item" onClick={() => navigate('/orders')}>
          <Package size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>Мои заказы</span>
          <span className="count">{orders.length}</span>
        </button>
        <button className="menu__item" onClick={() => navigate('/favorites')}>
          <Heart size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>Избранное</span>
          <span className="count">{favorites.length}</span>
        </button>
        <button className="menu__item" onClick={() => navigate('/cart')}>
          <ShoppingCart size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>Корзина</span>
        </button>
      </div>

      <div className="section-title">Помощь</div>
      <div className="menu">
        <a className="menu__item" href="tel:88007703003">
          <Phone size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>8 (800) 770-30-03</span>
          <ChevronRight size={18} color="#c2c9d1" className="count" />
        </a>
        <button className="menu__item">
          <MapPin size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>Адреса магазинов</span>
          <ChevronRight size={18} color="#c2c9d1" className="count" />
        </button>
        <button className="menu__item">
          <Truck size={20} strokeWidth={1.8} color="#0aa64b" />
          <span>Условия доставки</span>
          <ChevronRight size={18} color="#c2c9d1" className="count" />
        </button>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--tg-hint)', marginTop: 24, fontSize: 12 }}>
        КИРГУ · версия 0.2.0 (демо)
      </div>
    </div>
  )
}
