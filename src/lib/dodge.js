// Pure helper that decides where the NO button should jump next.
// Kept free of React/DOM so it is easy to reason about (and test).

const inflate = (r, p) => ({ left: r.left - p, top: r.top - p, right: r.right + p, bottom: r.bottom + p })

const overlapArea = (a, b) => {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left)
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
  return w > 0 && h > 0 ? w * h : 0
}

/**
 * @param vw,vh   visible viewport size
 * @param size    {w,h} of the NO button
 * @param avoid   DOMRect-like boxes to stay clear of (YES button, heading, music button)
 * @param from    {x,y} current top-left of the NO button
 * @param pointer {x,y} where the cursor / finger currently is
 * @returns {x,y} top-left in viewport coordinates, always fully inside the viewport
 */
export function pickSpot({ vw, vh, size, avoid = [], from, pointer, margin = 12, pad = 14, tries = 60, rand = Math.random }) {
  const minX = margin
  const minY = margin
  const maxX = Math.max(minX, vw - size.w - margin)
  const maxY = Math.max(minY, vh - size.h - margin)

  let best = { x: minX, y: minY }
  let bestScore = Infinity

  for (let i = 0; i < tries; i++) {
    const x = minX + rand() * (maxX - minX)
    const y = minY + rand() * (maxY - minY)
    const box = { left: x, top: y, right: x + size.w, bottom: y + size.h }

    // 1. never sit on top of the YES button, the question, or the music button
    let score = 0
    for (const a of avoid) score += overlapArea(box, inflate(a, pad))

    // 2. stay away from the cursor/finger so she can't just tap where it lands
    const d = Math.hypot(x + size.w / 2 - pointer.x, y + size.h / 2 - pointer.y)
    if (d < 160) score += (160 - d) * 40

    // 3. make every jump a real, funny leap
    const moved = Math.hypot(x - from.x, y - from.y)
    if (moved < 130) score += (130 - moved) * 40

    if (score < bestScore) {
      bestScore = score
      best = { x, y }
      if (score === 0) break
    }
  }
  return best
}
