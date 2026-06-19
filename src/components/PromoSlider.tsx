import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { promos } from '../data/promos'

export function PromoSlider() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % promos.length), 5000)
    return () => clearInterval(t)
  }, [])

  const promo = promos[i]

  return (
    <div className="slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={promo.id}
          className="slide"
          style={{ background: promo.gradient }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate(promo.to)}
          role="button"
        >
          <span className="slide__emoji">{promo.emoji}</span>
          <h2>{promo.title}</h2>
          <p>{promo.subtitle}</p>
          <button className="btn btn--lime" style={{ alignSelf: 'flex-start' }}>
            {promo.cta}
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="slider__dots">
        {promos.map((p, idx) => (
          <button
            key={p.id}
            className={`slider__dot ${idx === i ? 'active' : ''}`}
            onClick={() => setI(idx)}
            aria-label={`Слайд ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
