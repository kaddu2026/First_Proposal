import { useId } from 'react'

// "Kaddu" means pumpkin, so the little companion is a pumpkin.
// mood: 'happy' | 'wave' | 'love'
const TINY_HEART = 'M0 6 C-9 -2 -5 -10 0 -5 C5 -10 9 -2 0 6Z'

export default function Pumpkin({ mood = 'happy', className = '' }) {
  const uid = useId().replace(/:/g, '')
  const skin = `pk-skin-${uid}`

  return (
    <svg className={`pumpkin ${className}`} viewBox="0 0 200 180" role="img" aria-label="A cute little pumpkin">
      <defs>
        <radialGradient id={skin} cx="50%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ffe3cc" />
          <stop offset="1" stopColor="#ffb68a" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="167" rx="72" ry="8" fill="#e9507f" opacity=".13" />

      <g className="pumpkin__body">
        {/* feet */}
        <ellipse cx="78" cy="161" rx="14" ry="8" fill="#f4a47a" />
        <ellipse cx="122" cy="161" rx="14" ry="8" fill="#f4a47a" />

        {/* three lobes make the classic pumpkin shape */}
        <ellipse cx="56" cy="108" rx="44" ry="51" fill={`url(#${skin})`} stroke="#f4a47a" strokeWidth="2" />
        <ellipse cx="144" cy="108" rx="44" ry="51" fill={`url(#${skin})`} stroke="#f4a47a" strokeWidth="2" />
        <ellipse cx="100" cy="106" rx="52" ry="56" fill={`url(#${skin})`} stroke="#f4a47a" strokeWidth="2" />
        <path d="M76 58 C62 88 62 128 76 156" fill="none" stroke="#f4a47a" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M124 58 C138 88 138 128 124 156" fill="none" stroke="#f4a47a" strokeWidth="2" strokeLinecap="round" opacity=".7" />

        {/* stem, leaf, curl */}
        <path d="M93 58 C91 42 95 33 103 28 L112 35 C108 42 108 50 108 59 Z" fill="#a77d63" />
        <path d="M108 40 C124 22 144 28 148 42 C134 50 118 48 108 40 Z" fill="#a9d3a4" />
        <path d="M112 40 C122 36 133 38 142 42" fill="none" stroke="#8cc08a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M100 34 C86 20 74 28 80 38 C84 44 93 40 89 34" fill="none" stroke="#8cc08a" strokeWidth="3" strokeLinecap="round" />

        {/* arms */}
        <ellipse cx="29" cy="126" rx="11" ry="7" fill="#ffb68a" stroke="#f4a47a" strokeWidth="2" />
        <g className={mood === 'wave' ? 'pumpkin__arm pumpkin__arm--wave' : 'pumpkin__arm'}>
          <ellipse cx="173" cy={mood === 'wave' ? 108 : 126} rx="11" ry="7" fill="#ffb68a" stroke="#f4a47a" strokeWidth="2" transform={mood === 'wave' ? 'rotate(-55 173 108)' : undefined} />
        </g>

        {/* face */}
        <g className="pumpkin__eyes">
          {mood === 'love' ? (
            <>
              <path className="pumpkin__loveeye" d={TINY_HEART} transform="translate(80 108) scale(1.25)" fill="#e9507f" />
              <path className="pumpkin__loveeye" d={TINY_HEART} transform="translate(120 108) scale(1.25)" fill="#e9507f" />
            </>
          ) : (
            <>
              <ellipse cx="80" cy="108" rx="6.5" ry="8.5" fill="#5a2b45" />
              <ellipse cx="120" cy="108" rx="6.5" ry="8.5" fill="#5a2b45" />
              <circle cx="82.200" cy="104.500" r="2.300" fill="#fff" />
              <circle cx="122.200" cy="104.500" r="2.300" fill="#fff" />
            </>
          )}
        </g>
        <ellipse cx="64" cy="125" rx="10" ry="6" fill="#ff7fa3" opacity=".55" />
        <ellipse cx="136" cy="125" rx="10" ry="6" fill="#ff7fa3" opacity=".55" />
        {mood === 'love' ? (
          <path d="M88 121 Q100 143 112 121 Z" fill="#c93a68" stroke="#5a2b45" strokeWidth="2.500" strokeLinejoin="round" />
        ) : (
          <path d="M90 123 Q100 134 110 123" fill="none" stroke="#5a2b45" strokeWidth="3" strokeLinecap="round" />
        )}
      </g>
    </svg>
  )
}
