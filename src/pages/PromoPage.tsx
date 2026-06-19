import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { promos } from '../data/promos'
import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard'

export function PromoPage() {
  const navigate = useNavigate()
  const discounted = products.filter((p) => p.oldPrice)

  return (
    <>
      <h1 className="page-title">Акции и скидки</h1>

      <div className="stack">
        {promos.map((p, i) => (
          <motion.div
            key={p.id}
            className="slide"
            style={{ background: p.gradient, minHeight: 140 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(p.to)}
            role="button"
          >
            <span className="slide__emoji">{p.emoji}</span>
            <h2>{p.title}</h2>
            <p>{p.subtitle}</p>
            <button className="btn btn--lime" style={{ alignSelf: 'flex-start' }}>
              {p.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Товары со скидкой</h2>
        </div>
        <div className="grid">
          {discounted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
