import { useEffect, useRef, useState } from 'react'
import { createConfetti } from '../lib/confetti.js'
import Pumpkin from './Pumpkin.jsx'

// A big beating heart with sparkles circling it.
function BigHeart() {
  return (
    <div className="bigheart" aria-hidden="true">
      <div className="bigheart__orbit">
        <i style={{ '--a': '0deg' }} />
        <i style={{ '--a': '120deg' }} />
        <i style={{ '--a': '240deg' }} />
      </div>
      <svg className="bigheart__svg" viewBox="0 0 120 110" focusable="false">
        <defs>
          <linearGradient id="bh-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff9cbc" />
            <stop offset="1" stopColor="#e23c72" />
          </linearGradient>
        </defs>
        <path
          d="M60 102S6 68 6 35C6 18 19 8 33 8c11 0 21 6 27 16C66 14 76 8 87 8c14 0 27 10 27 27 0 33-54 67-54 67z"
          fill="url(#bh-fill)"
        />
        <ellipse cx="34" cy="30" rx="12" ry="7" transform="rotate(-38 34 30)" fill="#fff" opacity=".45" />
      </svg>
    </div>
  )
}

export default function Celebration({ onReplay }) {
  const canvasRef = useRef(null)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fx = createConfetti(canvasRef.current, { reduced })
    fx.start()
    fx.explode() // the heart explosion
    const t1 = setTimeout(fx.cannons, 450) // confetti cannons
    const t2 = setTimeout(fx.explode, 1500) // one more burst behind the message
    const t3 = setTimeout(() => setShowCard(true), reduced ? 0 : 1000)
    return () => {
      ;[t1, t2, t3].forEach(clearTimeout)
      fx.stop()
    }
  }, [])

  return (
    <section className="scene scene--yes" aria-label="She said yes">
      <canvas ref={canvasRef} className="fx" aria-hidden="true" />
      {showCard && (
        <article className="letter" aria-live="polite">
          <BigHeart />
          <h2 className="display yes__title">YAYYYYY!!! {'\u2764\uFE0F\uD83E\uDD79'}</h2>
          <p className="yes__line yes__line--1">You just made someone the happiest person alive!</p>
          <p className="yes__line yes__line--2">
            I promise to keep making you smile, annoying you with silly jokes, listening to your stories and making beautiful memories together.
          </p>
          <p className="yes__line yes__line--3">Thank you for giving us a chance, Kaddu! {'\u2764\uFE0F'}</p>
          <p className="yes__line yes__line--4 signoff">
            With lots of love,
            <br />
            <span className="signature">Bhavesh {'\u2764\uFE0F'}</span>
          </p>
          <div className="yes__foot">
            <Pumpkin mood="love" className="yes__pumpkin" />
            <button type="button" className="btn btn-ghost" onClick={onReplay}>
              Replay {'\uD83D\uDC9E'}
            </button>
          </div>
        </article>
      )}
    </section>
  )
}
