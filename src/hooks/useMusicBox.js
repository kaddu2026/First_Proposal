import { useCallback, useEffect, useRef, useState } from 'react'

// A tiny music-box lullaby synthesised with the Web Audio API.
// No audio files to ship, no licensing worries, and it only ever starts
// from a click/tap (browsers require that anyway).

const BPM = 76
const STEP = 60 / BPM / 2 // one eighth note, in seconds
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)

// Four bars, C - Am - F - G, eight eighth-note steps per bar.
const ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1]
const BARS = [
  { bass: 48, tones: [72, 76, 79], melody: { 0: 84, 4: 79, 6: 76 } },
  { bass: 45, tones: [69, 72, 76], melody: { 0: 81, 4: 84, 6: 81 } },
  { bass: 41, tones: [69, 72, 77], melody: { 0: 84, 4: 81, 6: 77 } },
  { bass: 43, tones: [71, 74, 79], melody: { 0: 83, 4: 86, 6: 79 } },
]
const TOTAL_STEPS = BARS.length * 8

// One soft "tine": a triangle tone plus a faint, slightly sharp overtone.
function tine(ctx, dest, when, midi, { gain = 0.1, dur = 1.8, type = 'triangle', shimmer = 0.22 } = {}) {
  const g = ctx.createGain()
  const o1 = ctx.createOscillator()
  o1.type = type
  o1.frequency.value = mtof(midi)
  o1.connect(g)

  if (shimmer) {
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = 'sine'
    o2.frequency.value = mtof(midi) * 2.01
    g2.gain.value = shimmer
    o2.connect(g2)
    g2.connect(g)
    o2.start(when)
    o2.stop(when + dur + 0.1)
  }

  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime(gain, when + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  g.connect(dest)
  o1.start(when)
  o1.stop(when + dur + 0.1)
}

function scheduleStep(ctx, dest, step, when) {
  const bar = BARS[Math.floor(step / 8)]
  const i = step % 8
  tine(ctx, dest, when, bar.tones[ARP_PATTERN[i]], { gain: 0.07, dur: 1.4 })
  if (i === 0 || i === 4) tine(ctx, dest, when, bar.bass, { gain: 0.09, dur: 2.4, type: 'sine', shimmer: 0 })
  const m = bar.melody[i]
  if (m) tine(ctx, dest, when, m, { gain: 0.1, dur: 2.2, shimmer: 0.3 })
}

export function useMusicBox() {
  const [playing, setPlaying] = useState(false)
  const engine = useRef(null) // { ctx, master, timer, step, next }
  const userPaused = useRef(false)

  const ensureEngine = () => {
    if (engine.current) return engine.current
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    const ctx = new Ctx()

    // master -> speakers, plus a soft echo to make it dreamy
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    const echo = ctx.createDelay(1)
    echo.delayTime.value = STEP * 3
    const feedback = ctx.createGain()
    feedback.gain.value = 0.32
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2400
    echo.connect(tone)
    tone.connect(feedback)
    feedback.connect(echo)
    tone.connect(master)

    const bus = ctx.createGain()
    bus.connect(master)
    bus.connect(echo)

    engine.current = { ctx, master, bus, timer: 0, step: 0, next: 0 }
    return engine.current
  }

  const play = useCallback(async () => {
    const e = ensureEngine()
    if (!e) return
    try {
      await e.ctx.resume()
    } catch {
      return
    }
    if (e.timer) return
    e.next = e.ctx.currentTime + 0.1
    e.master.gain.cancelScheduledValues(e.ctx.currentTime)
    e.master.gain.setTargetAtTime(0.85, e.ctx.currentTime, 0.6)
    // Look-ahead scheduler: every 100ms queue whatever falls in the next 400ms.
    e.timer = window.setInterval(() => {
      while (e.next < e.ctx.currentTime + 0.4) {
        scheduleStep(e.ctx, e.bus, e.step, e.next)
        e.next += STEP
        e.step = (e.step + 1) % TOTAL_STEPS
      }
    }, 100)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => {
    const e = engine.current
    if (!e) return
    window.clearInterval(e.timer)
    e.timer = 0
    e.master.gain.cancelScheduledValues(e.ctx.currentTime)
    e.master.gain.setTargetAtTime(0, e.ctx.currentTime, 0.12)
    window.setTimeout(() => {
      if (!e.timer) e.ctx.suspend().catch(() => {})
    }, 700)
    setPlaying(false)
  }, [])

  // Called from the mute/play button.
  const toggle = useCallback(() => {
    if (engine.current?.timer) {
      userPaused.current = true
      pause()
    } else {
      userPaused.current = false
      play()
    }
  }, [play, pause])

  // Called when she says YES: starts the music unless she has muted it herself.
  const autoStart = useCallback(() => {
    if (!userPaused.current) play()
  }, [play])

  useEffect(
    () => () => {
      const e = engine.current
      if (!e) return
      window.clearInterval(e.timer)
      e.ctx.close().catch(() => {})
      engine.current = null
    },
    [],
  )

  return { playing, toggle, autoStart }
}
