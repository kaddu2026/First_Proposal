import { useState } from 'react'
import { FEELINGS } from '../data/messages.js'

// Messages appear one at a time, at her pace. Earlier lines stay, softly faded.
export default function Feelings({ onDone, burst }) {
  const [shown, setShown] = useState(1)
  const last = shown === FEELINGS.length

  const next = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top, 8)
    if (last) onDone()
    else setShown((n) => n + 1)
  }

  return (
    <section className="scene scene--feelings" aria-label="A few things I feel">
      <div className="feelings" aria-live="polite">
        {FEELINGS.slice(0, shown).map((line, i) => (
          <p key={line} className={`feeling display ${i === shown - 1 ? 'is-new' : 'is-past'}`}>
            {line}
          </p>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={next}>
        {last ? <>There&rsquo;s more {'\u2728'}</> : <>Go on {'\uD83D\uDC97'}</>}
      </button>
    </section>
  )
}
