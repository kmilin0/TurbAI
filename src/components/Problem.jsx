import { useState } from 'react'
import { questions } from '../data.js'

export default function Problem() {
  const [i, setI] = useState(0)
  return (
    <div className="problem-in">
      <ul className="qs">
        {questions.map((q, k) => (
          <li key={q.q}>
            <button className="q" aria-pressed={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)}>
              <span>0{k + 1}</span>{q.q}
            </button>
          </li>
        ))}
      </ul>
      <div className="card answer" aria-live="polite">
        <p className="label"><span className="logo-dot" />Lo que TurbAI te diría</p>
        <p key={i} className="answer-text">{questions[i].a}</p>
        <p className="caption">Respuesta de ejemplo.</p>
      </div>
    </div>
  )
}
