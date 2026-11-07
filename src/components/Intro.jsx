import Pumpkin from './Pumpkin.jsx'

export default function Intro({ onBegin }) {
  return (
    <section className="scene scene--intro" aria-labelledby="intro-title">
      <Pumpkin mood="wave" className="intro__pumpkin" />
      <h1 id="intro-title" className="display intro__title">
        Hey Kaddu! <span className="beat" aria-hidden="true">{'\u2764\uFE0F'}</span>
        <span className="sr-only">heart</span>
      </h1>
      <p className="intro__line intro__line--1">I made something special for you...</p>
      <p className="intro__line intro__line--2">There&rsquo;s something I&rsquo;ve been wanting to tell you.</p>
      <button type="button" className="btn btn-primary btn-begin" onClick={onBegin}>
        Let&rsquo;s Begin <span className="twinkle" aria-hidden="true">{'\u2728'}</span>
      </button>
    </section>
  )
}
