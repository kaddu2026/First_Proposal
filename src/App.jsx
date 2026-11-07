import { useCallback, useRef, useState } from 'react'
import Ambient from './components/Ambient.jsx'
import BurstLayer from './components/BurstLayer.jsx'
import MusicControl from './components/MusicControl.jsx'
import Intro from './components/Intro.jsx'
import Feelings from './components/Feelings.jsx'
import Surprises from './components/Surprises.jsx'
import Question from './components/Question.jsx'
import Celebration from './components/Celebration.jsx'
import { useMusicBox } from './hooks/useMusicBox.js'

const GLYPHS = ['\uD83D\uDC97', '\uD83D\uDC96', '\uD83D\uDC95', '\u2728', '\uD83C\uDF38', '\uD83D\uDC9E']

// The journey: intro -> feelings -> surprises -> question -> yes
export default function App() {
  const [stage, setStage] = useState('intro')
  const [run, setRun] = useState(0) // bumped on replay so every screen starts fresh
  const [bursts, setBursts] = useState([])
  const idRef = useRef(0)
  const music = useMusicBox()

  // Emoji pop at a screen position (used by buttons and hearts).
  const burst = useCallback((x, y, count = 9) => {
    const batch = Array.from({ length: count }, () => {
      const a = Math.random() * Math.PI * 2
      const d = 50 + Math.random() * 90
      return {
        id: idRef.current++, x, y,
        dx: Math.cos(a) * d, dy: Math.sin(a) * d - 30,
        rot: (Math.random() - 0.5) * 70,
        g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        s: 14 + Math.random() * 14,
      }
    })
    setBursts((b) => [...b, ...batch])
    setTimeout(() => setBursts((b) => b.filter((i) => !batch.includes(i))), 1300)
  }, [])

  const begin = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top + r.height / 2, 10)
    setStage('feelings')
  }

  const sayYes = () => {
    music.autoStart() // runs inside her click, so the browser allows audio
    setStage('yes')
  }

  const replay = () => {
    setRun((n) => n + 1)
    setStage('intro')
  }

  return (
    <>
      <Ambient />
      <MusicControl playing={music.playing} onToggle={music.toggle} />
      <BurstLayer items={bursts} />
      <main className="stage" key={`${run}-${stage}`}>
        {stage === 'intro' && <Intro onBegin={begin} />}
        {stage === 'feelings' && <Feelings burst={burst} onDone={() => setStage('surprises')} />}
        {stage === 'surprises' && <Surprises burst={burst} onDone={() => setStage('question')} />}
        {stage === 'question' && <Question onYes={sayYes} />}
        {stage === 'yes' && <Celebration onReplay={replay} />}
      </main>
    </>
  )
}
