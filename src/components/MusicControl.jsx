// Mute / play control. `data-avoid` tells the NO button to keep clear of it.
export default function MusicControl({ playing, onToggle }) {
  return (
    <button
      type="button"
      className="music"
      data-avoid
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? 'Mute the music' : 'Play some music'}
      title={playing ? 'Mute the music' : 'Play some music'}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M9 18V6l10-2v12" opacity=".0" />
        <path d="M9 17V6.5l9-1.8V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.500" cy="17.500" r="2.500" fill="currentColor" />
        <circle cx="15.500" cy="15.500" r="2.500" fill="currentColor" />
        {!playing && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" />}
      </svg>
    </button>
  )
}
