// One reusable SVG heart. Colour comes from CSS `color`, so it themes easily.
export default function Heart({ className, style, shine = false }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 21.2s-8.3-5-10.1-10.3C.8 7.5 2.8 4.2 6.3 4.2c2.1 0 3.8 1.1 5.7 3.1 1.9-2 3.6-3.1 5.7-3.1 3.5 0 5.5 3.3 4.4 6.7C20.3 16.2 12 21.2 12 21.2z"
      />
      {shine && <ellipse cx="7.6" cy="8" rx="2.3" ry="1.4" transform="rotate(-38 7.6 8)" fill="#fff" opacity=".5" />}
    </svg>
  )
}
