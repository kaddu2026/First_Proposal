import { useCallback, useEffect, useRef, useState } from 'react'
import { NO_TAUNTS } from '../data/messages.js'
import { pickSpot } from '../lib/dodge.js'

// Screen 1: the lead-up, revealed line by line. Screen 2: the big question.
export default function Question({ onYes }) {
  const [phase, setPhase] = useState('ask')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4300)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'ask') {
    return (
      <section className="scene scene--ask" aria-label="A little question">
        <p className="ask__lead display">I have a little question for you...</p>
        <p className="ask__body ask__body--1">
          If I promise to annoy you with silly jokes, make you smile on bad days, listen to your endless stories, and care for you a little extra...
        </p>
        <p className="ask__body ask__body--2">Would you like to give us a chance? {'\u2764\uFE0F'}</p>
        <div className="cta-slot">
          {ready && (
            <button type="button" className="btn btn-primary reveal" onClick={() => setPhase('final')}>
              I&rsquo;m listening {'\uD83D\uDC8C'}
            </button>
          )}
        </div>
      </section>
    )
  }
  return <FinalAsk onYes={onYes} />
}

function FinalAsk({ onYes }) {
  const yesRef = useRef(null)
  const noRef = useRef(null)
  const pointer = useRef({ x: -999, y: -999 })
  const lastDodge = useRef(0)
  const fixedRef = useRef(false)
  const posRef = useRef({ x: 0, y: 0 })
  const count = useRef(0)
  const lastTaunt = useRef(-1)

  const [fixed, setFixed] = useState(false) // false = sitting in its slot, true = free-roaming (position: fixed)
  const [armed, setArmed] = useState(false) // turns the glide transition on after the first placement
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const [taunt, setTaunt] = useState({ text: '', key: 0 })

  // No page scrolling or pinch-zooming while she is trying to catch the button.
  useEffect(() => {
    const els = [document.documentElement, document.body]
    els.forEach((el) => el.classList.add('no-scroll'))
    yesRef.current?.focus({ preventScroll: true })
    return () => els.forEach((el) => el.classList.remove('no-scroll'))
  }, [])

  const place = (p) => {
    posRef.current = p
    setPos(p)
  }

  // Move the NO button somewhere else on screen.
  const dodge = useCallback(() => {
    const btn = noRef.current
    if (!btn) return
    const now = performance.now()
    if (now - lastDodge.current < 170) return // short cooldown stops jitter
    lastDodge.current = now

    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const here = btn.getBoundingClientRect()
    const avoid = [...document.querySelectorAll('[data-avoid]')].map((el) => el.getBoundingClientRect())
    const target = pickSpot({
      vw,
      vh,
      size: { w: here.width, h: here.height },
      avoid,
      from: { x: here.left, y: here.top },
      pointer: pointer.current,
    })

    if (!fixedRef.current) {
      // First escape: lift the button out of its slot exactly where it is, then glide away.
      fixedRef.current = true
      setArmed(false)
      setFixed(true)
      place({ x: here.left, y: here.top })
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setArmed(true)
          place(target)
        }),
      )
    } else {
      place(target)
    }

    const n = ++count.current
    setDodges(n)
    // Funny remarks: always on the first escape, then about every other time.
    if (n === 1 || Math.random() < 0.55) {
      let i
      do i = (Math.random() * NO_TAUNTS.length) | 0
      while (i === lastTaunt.current)
      lastTaunt.current = i
      setTaunt((t) => ({ text: NO_TAUNTS[i], key: t.key + 1 }))
    }
  }, [])

  // The button flees *before* it can be touched: whenever the cursor or a finger gets close.
  useEffect(() => {
    const isNear = (e) => {
      const r = noRef.current?.getBoundingClientRect()
      if (!r) return false
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right)
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom)
      return Math.hypot(dx, dy) < (e.pointerType === 'touch' ? 76 : 64)
    }
    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      if (e.pointerType !== 'touch' && isNear(e)) dodge()
    }
    const onDown = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      if (isNear(e)) dodge()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [dodge])

  // Keep it on screen if the window is resized or the phone is rotated.
  useEffect(() => {
    const onResize = () => {
      const btn = noRef.current
      if (!btn || !fixedRef.current) return
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const p = posRef.current
      place({
        x: Math.min(Math.max(12, p.x), Math.max(12, vw - btn.offsetWidth - 12)),
        y: Math.min(Math.max(12, p.y), Math.max(12, vh - btn.offsetHeight - 12)),
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const grow = Math.min(1 + dodges * 0.035, 1.3) // YES gets a little bolder with every escape

  return (
    <section className="scene scene--final" aria-label="The big question">
      <h2 className="big-ask display" data-avoid>
        Kaddu, will you be mine? <span aria-hidden="true">{'\u2764\uFE0F'}</span>
      </h2>

      <div className="answer-row">
        <button
          ref={yesRef}
          type="button"
          className="btn btn-yes"
          data-avoid
          style={{ '--grow': grow }}
          onClick={onYes}
        >
          YES! {'\u2764\uFE0F'}
        </button>

        {/* The slot keeps the layout steady once the button has run away. */}
        <div className="no-slot">
          <button
            ref={noRef}
            type="button"
            className={`btn btn-no ${fixed ? 'is-fixed' : ''} ${armed ? 'is-armed' : ''}`}
            style={fixed ? { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` } : undefined}
            tabIndex={-1}
            aria-label="No (this button runs away)"
            onPointerEnter={dodge}
            onPointerDown={dodge}
            onFocus={dodge}
            onClick={(e) => {
              e.preventDefault() // it can never actually be chosen
              dodge()
            }}
          >
            <span key={dodges} className={dodges ? 'no-label wiggle' : 'no-label'}>
              NO {'\uD83D\uDE48'}
            </span>
          </button>
        </div>
      </div>

      <p key={taunt.key} className="taunt" role="status" aria-live="polite">
        {taunt.text}
      </p>
    </section>
  )
}
