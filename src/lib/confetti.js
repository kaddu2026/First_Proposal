// A small canvas particle engine for the celebration:
// confetti, hearts, flowers and sparkles. No libraries, one <canvas>.

const PINKS = ['#ff6b9a', '#ff8fb1', '#ffb3c7', '#ffc2d4', '#e9507f', '#f9a8c4']
const CONFETTI = [...PINKS, '#ffd9a8', '#fff1a8', '#d9c9ff', '#bfe9d3', '#ffffff']
const FLOWERS = ['\uD83C\uDF38', '\uD83C\uDF37', '\uD83C\uDF39', '\uD83C\uDF3C', '\uD83D\uDC90']
const MAX_PARTICLES = 340
const MAX_FLOWERS = 45

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

function heartPath(c, s) {
  c.beginPath()
  c.moveTo(0, s * 0.55)
  c.bezierCurveTo(-s * 1.05, -s * 0.1, -s * 0.55, -s * 0.9, 0, -s * 0.32)
  c.bezierCurveTo(s * 0.55, -s * 0.9, s * 1.05, -s * 0.1, 0, s * 0.55)
  c.closePath()
}

function sparklePath(c, s) {
  c.beginPath()
  c.moveTo(0, -s)
  c.quadraticCurveTo(0, 0, s, 0)
  c.quadraticCurveTo(0, 0, 0, s)
  c.quadraticCurveTo(0, 0, -s, 0)
  c.quadraticCurveTo(0, 0, 0, -s)
  c.closePath()
}

export function createConfetti(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let particles = []
  let raf = 0
  let last = 0
  let rainUntil = 0
  let rainCarry = 0

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const flowers = () => particles.reduce((n, p) => n + (p.kind === 'flower' ? 1 : 0), 0)

  function add(p) {
    if (particles.length >= MAX_PARTICLES) return
    if (p.kind === 'flower' && flowers() >= MAX_FLOWERS) return
    particles.push({ age: 0, rot: rand(0, 6.28), vr: rand(-3, 3), flip: rand(0, 6.28), ...p })
  }

  // Burst of hearts, sparkles and flowers flying out from one point.
  function explode(cx = w / 2, cy = h / 2) {
    const k = reduced ? 0.3 : 1
    for (let i = 0; i < 70 * k; i++) {
      const a = rand(0, Math.PI * 2)
      const v = rand(260, 900)
      add({ kind: 'heart', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, g: 260, drag: 2.1, size: rand(8, 20), life: rand(2.4, 3.6), color: pick(PINKS) })
    }
    for (let i = 0; i < 26 * k; i++) {
      const a = rand(0, Math.PI * 2)
      const v = rand(200, 720)
      add({ kind: 'sparkle', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 40, drag: 2.4, size: rand(5, 11), life: rand(1.2, 2.2), color: pick(['#fff6c9', '#ffffff', '#ffe08a']) })
    }
    for (let i = 0; i < 14 * k; i++) {
      const a = rand(0, Math.PI * 2)
      const v = rand(300, 760)
      add({ kind: 'flower', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 100, g: 320, drag: 1.9, size: rand(18, 30), life: rand(2.8, 4), glyph: pick(FLOWERS) })
    }
  }

  // Two confetti cannons from the bottom corners.
  function cannons() {
    const k = reduced ? 0.25 : 1
    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < 48 * k; i++) {
        const spread = rand(-0.5, 0.5)
        const a = (side === 0 ? -1.15 : -Math.PI + 1.15) + spread
        const v = rand(720, 1250)
        add({ kind: 'confetti', x: side === 0 ? 0 : w, y: h, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 720, drag: 1.7, size: rand(6, 11), life: rand(3.5, 5), color: pick(CONFETTI) })
      }
    }
  }

  // One falling piece from above the screen.
  function drop() {
    const r = Math.random()
    const base = { x: rand(0, w), y: -20, vx: rand(-30, 30), vy: rand(40, 120), sway: rand(14, 42), swayPhase: rand(0, 6.28), swaySpeed: rand(1.2, 2.6) }
    if (r < 0.34) add({ ...base, kind: 'confetti', g: 160, drag: 1.6, size: rand(6, 10), life: rand(6, 9), color: pick(CONFETTI) })
    else if (r < 0.64) add({ ...base, kind: 'heart', g: 120, drag: 1.5, size: rand(7, 15), life: rand(6, 9), color: pick(PINKS) })
    else if (r < 0.86) add({ ...base, kind: 'flower', g: 110, drag: 1.4, size: rand(16, 26), life: rand(7, 10), glyph: pick(FLOWERS) })
    else add({ ...base, kind: 'sparkle', g: 60, drag: 1.4, size: rand(5, 9), life: rand(4, 6), color: '#fff6c9' })
  }

  function step(t) {
    raf = requestAnimationFrame(step)
    const dt = Math.min((t - (last || t)) / 1000, 0.05)
    last = t

    // Falling pieces: a heavy shower at first, then a gentle trickle that never stops.
    if (!reduced) {
      const rate = t < rainUntil ? 26 : 2.2
      rainCarry += rate * dt
      while (rainCarry >= 1) {
        drop()
        rainCarry -= 1
      }
    }

    ctx.clearRect(0, 0, w, h)
    const alive = []
    for (const p of particles) {
      p.age += dt
      if (p.age >= p.life || p.y > h + 40) continue
      const damp = Math.exp(-p.drag * dt)
      p.vx *= damp
      p.vy = p.vy * damp + p.g * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.sway) {
        p.swayPhase += p.swaySpeed * dt
        p.x += Math.cos(p.swayPhase) * p.sway * dt
      }
      p.rot += p.vr * dt
      p.flip += 6 * dt
      alive.push(p)

      const fadeStart = p.life * 0.75
      ctx.globalAlpha = p.age > fadeStart ? Math.max(0, 1 - (p.age - fadeStart) / (p.life - fadeStart)) : 1
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      if (p.kind === 'confetti') {
        ctx.scale(1, Math.cos(p.flip))
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66)
      } else if (p.kind === 'heart') {
        ctx.fillStyle = p.color
        heartPath(ctx, p.size)
        ctx.fill()
      } else if (p.kind === 'sparkle') {
        ctx.fillStyle = p.color
        ctx.scale(1 + Math.sin(p.age * 12) * 0.25, 1 + Math.sin(p.age * 12) * 0.25)
        sparklePath(ctx, p.size)
        ctx.fill()
      } else {
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.glyph, 0, 0)
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1
    particles = alive
  }

  return {
    start() {
      resize()
      window.addEventListener('resize', resize)
      rainUntil = performance.now() + 9000
      raf = requestAnimationFrame(step)
    },
    explode,
    cannons,
    stop() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      particles = []
    },
  }
}
