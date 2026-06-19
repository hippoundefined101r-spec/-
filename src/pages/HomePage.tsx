import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PromoSlider } from '../components/PromoSlider'
import { Section } from '../components/Section'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { advantages, reviews, blogPosts } from '../data/promos'
import { INSTALLMENT_MONTHS } from '../config'

export function HomePage() {
  const navigate = useNavigate()
  const hits = products.filter((p) => p.isHit)
  const fresh = products.filter((p) => p.isNew)
  const brandList = ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'Dyson', 'Anker']

  return (
    <>
      {/* Hero */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="hero__badge">🔥 Рассрочка до {INSTALLMENT_MONTHS} мес</span>
        <h1>
          Смартфоны и техника
          <br />
          <span className="hero__big">в рассрочку 0%</span>
        </h1>
        <p>Оригинальная техника в Махачкале. Трейд-ин, гарантия и доставка по всей России.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn--lime" onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </button>
          <button
            className="btn btn--ghost"
            style={{ background: 'rgba(0,0,0,.2)', color: '#fff', borderColor: 'transparent' }}
            onClick={() => navigate('/trade-in')}
          >
            🔄 Трейд-ин
          </button>
        </div>
      </motion.div>

      <PromoSlider />

      {/* Категории */}
      <Section title="Категории">
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/catalog?cat=${c.id}`} className="cat-tile">
              <span className="cat-tile__icon">{c.icon}</span>
              <span className="cat-tile__title">{c.title}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Хиты продаж */}
      <Section title="Хиты продаж" link={{ to: '/catalog', label: 'Все товары' }}>
        <div className="rail">
          {hits.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Преимущества */}
      <Section title="Почему мы">
        <div className="adv-grid">
          {advantages.map((a) => (
            <div className="adv" key={a.title}>
              <div className="adv__icon">{a.icon}</div>
              <div className="adv__title">{a.title}</div>
              <div className="adv__text">{a.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Новинки */}
      <Section title="Новинки" link={{ to: '/catalog', label: 'Смотреть' }}>
        <div className="rail">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Бренды */}
      <Section title="Бренды">
        <div className="brands">
          {brandList.map((b) => (
            <Link key={b} to={`/catalog?q=${encodeURIComponent(b)}`} className="brand-pill">
              {b}
            </Link>
          ))}
        </div>
      </Section>

      {/* Отзывы */}
      <Section title="Отзывы покупателей">
        <div className="rail">
          {reviews.map((r) => (
            <div className="review" key={r.id}>
              <div className="review__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <p className="review__text">{r.text}</p>
              <div className="review__meta">
                <span className="review__author">{r.author}</span> · {r.city} · {r.date}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Блог */}
      <Section title="Блог и обзоры" link={{ to: '/blog', label: 'Все статьи' }}>
        <div className="grid-3">
          {blogPosts.map((b) => (
            <Link to="/blog" key={b.id} className="post">
              <div className="post__cover">{b.emoji}</div>
              <div className="post__body">
                <div className="post__date">{b.date}</div>
                <div className="post__title">{b.title}</div>
                <div className="post__excerpt">{b.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
