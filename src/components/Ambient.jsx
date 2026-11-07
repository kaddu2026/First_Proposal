import { useMemo } from 'react'
import Heart from './Heart.jsx'

// The dreamy background: a gradient with slow drifting glows, rising hearts,
// falling petals and twinkling sparkles. Everything is pure CSS animation on
// transform/opacity, so it stays smooth on phones. Randomised once per visit.

const r = (min, max) => min + Math.random() * (max - min)
const HEARTS = ['#ff8fb1', '#ffb3c7', '#f46a93', '#ffc2d4', '#e9507f', '#ffa5c0']
const PETALS = ['#ffc7d6', '#ffb3c7', '#ffd9e2', '#ffa9c1']

export default function Ambient() {
  const { hearts, petals, sparkles } = useMemo(() => {
    const compact = window.matchMedia('(max-width: 640px)').matches
    const n = (count) => (compact ? Math.round(count * 0.6) : count)
    return {
      hearts: Array.from({ length: n(14) }, () => ({
        x: r(2, 96), size: r(14, 34), dur: r(15, 27), delay: -r(0, 27), drift: r(-70, 70), o: r(0.25, 0.6),
        color: HEARTS[(Math.random() * HEARTS.length) | 0],
      })),
      petals: Array.from({ length: n(12) }, () => ({
        x: r(0, 100), size: r(10, 18), dur: r(12, 22), delay: -r(0, 22), drift: r(-140, 140), spin: r(200, 560),
        color: PETALS[(Math.random() * PETALS.length) | 0],
      })),
      sparkles: Array.from({ length: n(16) }, () => ({
        x: r(2, 98), y: r(2, 98), size: r(6, 14), dur: r(2.4, 4.6), delay: -r(0, 4.6),
      })),
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__glow ambient__glow--a" />
      <div className="ambient__glow ambient__glow--b" />
      <div className="ambient__glow ambient__glow--c" />

      <div className="ambient__items">
        {hearts.map((h, i) => (
          <span
            key={`h${i}`}
            className="float-heart"
            style={{ '--x': `${h.x}%`, '--s': `${h.size}px`, '--d': `${h.dur}s`, '--delay': `${h.delay}s`, '--drift': `${h.drift}px`, '--o': h.o, color: h.color }}
          >
            <Heart />
          </span>
        ))}
        {petals.map((p, i) => (
          <span
            key={`p${i}`}
            className="petal"
            style={{ '--x': `${p.x}%`, '--s': `${p.size}px`, '--d': `${p.dur}s`, '--delay': `${p.delay}s`, '--drift': `${p.drift}px`, '--spin': `${p.spin}deg`, '--c': p.color }}
          >
            <i />
          </span>
        ))}
        {sparkles.map((s, i) => (
          <span
            key={`s${i}`}
            className="sparkle"
            style={{ '--x': `${s.x}%`, '--y': `${s.y}%`, '--s': `${s.size}px`, '--d': `${s.dur}s`, '--delay': `${s.delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}
