import { useState } from 'react'
import { phases, mvp } from '../data.js'

export default function Roadmap() {
  const [i, setI] = useState(0)
  const p = phases[i]
  return (
    <>
      <ol className="phases">
        {phases.map((ph, k) => (
          <li key={ph.name}>
            <button className={`phase ${k === 0 ? 'now' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
              <small>{ph.tag}</small>
              <b>{ph.name}</b>
            </button>
          </li>
        ))}
      </ol>
      <div className="card phase-detail" key={i}>
        <div>
          <p className="label"><b>{p.tag}</b>{i === 0 ? 'Primer paso' : 'Visión de producto'}</p>
          <h3>TurbAI {p.name}</h3>
          <p className="muted">{p.text} {p.detail}</p>
        </div>
        {i === 0 ? (
          <div>
            <p className="label">Lo que incluye el MVP</p>
            <ul className="checks">{mvp.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        ) : (
          <p className="caption">Las fases 2 a 5 son visión de producto a mediano y largo plazo, no funcionalidad ya construida.</p>
        )}
      </div>
    </>
  )
}
