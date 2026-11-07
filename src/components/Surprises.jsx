import { useEffect, useRef, useState } from 'react'
import Heart from './Heart.jsx'
import Pumpkin from './Pumpkin.jsx'
import { SURPRISES, PUMPKIN_POKES } from '../data/messages.js'

// Where each floating heart lives inside the heart field (percentages).
const SPOTS = [
  { x: 15, y: 24, size: 62, color: '#ff8fb1' },
  { x: 72, y: 12, size: 56, color: '#f46a93' },
  { x: 44, y: 44, size: 68, color: '#e9507f' },
  { x: 86, y: 52, size: 58, color: '#ffa5c0' },
  { x: 18, y: 72, size: 58, color: '#f9799f' },
  { x: 62, y: 80, size: 62, color: '#ff8fb1' },
  { x: 40, y: 10, size: 54, color: '#ffb3c7' },
]
const NEEDED = 3 // hearts to pop before "continue" appears
const BACK_AFTER = 5500 // popped hearts float back so the field never empties

const shuffle = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Surprises({ onDone, burst }) {
  const [gone, setGone] = useState(() => new Set())
  const [popped, setPopped] = useState(0)
  const [say, setSay] = useState({ text: 'Tap a heart, Kaddu. I dare you. \uD83D\uDC97', key: 0 })
  const [hop, setHop] = useState(0)
  const queue = useRef([])
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Shuffled deck: every sweet message shows once before any repeats.
  const nextSurprise = () => {
    if (!queue.current.length) queue.current = shuffle(SURPRISES)
    return queue.current.pop()
  }

  const speak = (text) => {
    setSay((s) => ({ text, key: s.key + 1 }))
    setHop((n) => n + 1)
  }

  const pop = (i, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top + r.height / 2, 12)
    setGone((g) => new Set(g).add(i))
    setPopped((n) => n + 1)
    speak(nextSurprise())
    timers.current.push(
      setTimeout(() => {
        setGone((g) => {
          const n = new Set(g)
          n.delete(i)
          return n
        })
      }, BACK_AFTER),
    )
  }

  const poke = () => speak(Math.random() < 0.5 ? nextSurprise() : PUMPKIN_POKES[(Math.random() * PUMPKIN_POKES.length) | 0])

  const left = NEEDED - popped

  return (
    <section className="scene scene--surprises" aria-label="Little surprises">
      <h2 className="display surprises__title">Tap the floating hearts {'\uD83D\uDC97'}</h2>

      <div className="heart-field">
        {SPOTS.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`pop-heart ${gone.has(i) ? 'is-popped' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, '--size': `${s.size}px`, '--dur': `${3.2 + (i % 4) * 0.6}s`, '--delay': `${-i * 0.7}s`, color: s.color }}
            onClick={(e) => pop(i, e)}
            disabled={gone.has(i)}
            aria-label="Open a little surprise"
          >
            <span className="pop-heart__inner">
              <Heart shine />
            </span>
          </button>
        ))}
      </div>

      <div className="friend">
        <p key={say.key} className="bubble" role="status" aria-live="polite">
          {say.text}
        </p>
        <button type="button" className="pumpkin-btn" onClick={poke} aria-label="Poke the pumpkin">
          <span key={hop} className={hop ? 'hop' : ''}>
            <Pumpkin mood={popped >= NEEDED ? 'love' : 'happy'} />
          </span>
        </button>
      </div>

      <div className="cta-slot">
        {left <= 0 ? (
          <button type="button" className="btn btn-primary reveal" onClick={onDone}>
            I have one more thing&hellip; {'\uD83D\uDC8C'}
          </button>
        ) : (
          <p className="hint">
            {left} {left === 1 ? 'heart' : 'hearts'} to go
          </p>
        )}
      </div>
    </section>
  )
}
