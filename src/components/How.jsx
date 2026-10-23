import { useEffect, useState } from 'react'
import { steps } from '../data.js'

const noise = (n) => (Math.random() * 2 - 1) * n

function Measure() {
  const [r, setR] = useState({ e: 1.24, w: 0, t: 23.4 })
  useEffect(() => {
    const id = setInterval(() => {
      setR({ e: 1.24 + noise(0.06), w: Math.random() < 0.3 ? 6 + noise(2) : 0, t: 23.4 + noise(0.2) })
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <ul className="readings">
      <li><span>Energía</span><b>{r.e.toFixed(2)}<small>kW</small></b></li>
      <li><span>Agua</span><b>{r.w.toFixed(1)}<small>L/min</small></b></li>
      <li><span>Temperatura</span><b>{r.t.toFixed(1)}<small>°C</small></b></li>
    </ul>
  )
}

const days = [1.18, 1.25, 1.21, 1.3, 1.16, 1.22, 1.27, 1.2, 1.24, 1.19, 1.28, 1.23, 1.21, 1.26]

function Learn() {
  const W = 320
  const H = 140
  const x = (i) => 12 + (i * (W - 24)) / (days.length - 1)
  const y = (v) => H - 16 - ((v - 0.8) / 0.8) * (H - 32)
  const last = days.length - 1
  return (
    <div className="learn">
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <rect className="band" x="0" y={y(1.4)} width={W} height={y(1.0) - y(1.4)} rx="6" />
        {days.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 5 : 3.5} className={i === last ? 'today' : ''} />
        ))}
      </svg>
      <p><b className="mono">1.0 – 1.4 kWh/día</b>Lo normal para tu aire, aprendido de sus últimos 14 días.</p>
    </div>
  )
}

function Notify() {
  return (
    <div className="notif">
      <div className="toast-top"><span className="logo-dot" />TurbAI · ahora</div>
      <b>El aire de la habitación está consumiendo distinto</b>
      <p>Lleva 5 días un 34% por encima de su promedio. Te recomendamos una revisión antes de que falle.</p>
      <div className="notif-actions" aria-hidden="true">
        <span className="btn btn-primary btn-sm">Pedir técnico</span>
        <span className="btn btn-line btn-sm">Ver detalle</span>
      </div>
    </div>
  )
}

const stages = [Measure, Learn, Notify]

// Pasos que avanzan solos (la barra marca el tiempo) hasta que el usuario elige uno
export default function How() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const Stage = stages[i]
  return (
    <div className="how-in">
      <ol className={`tabs ${auto ? '' : 'paused'}`}>
        {steps.map((s, k) => (
          <li key={s.title}>
            <button className={`tab ${k === i ? 'on' : ''}`} aria-pressed={k === i} onClick={() => { setI(k); setAuto(false) }}>
              <span className="n">0{k + 1}</span>
              <span className="tab-title">{s.title}</span>
              <span className="tab-text">{s.text}</span>
              {k === i && <span className="tab-bar" onAnimationEnd={() => auto && setI((i + 1) % steps.length)} />}
            </button>
          </li>
        ))}
      </ol>
      <div className="card stage" key={i}>
        <p className="label"><b>0{i + 1}</b>{steps[i].title}</p>
        <Stage />
      </div>
    </div>
  )
}
