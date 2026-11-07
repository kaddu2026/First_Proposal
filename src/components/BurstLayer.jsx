// Little emoji pops that fly out of a tap/click. Purely decorative.
export default function BurstLayer({ items }) {
  return (
    <div className="burst-layer" aria-hidden="true">
      {items.map((b) => (
        <span
          key={b.id}
          className="burst"
          style={{ left: b.x, top: b.y, '--dx': `${b.dx}px`, '--dy': `${b.dy}px`, '--rot': `${b.rot}deg`, fontSize: b.s }}
        >
          {b.g}
        </span>
      ))}
    </div>
  )
}
