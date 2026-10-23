import { useEffect, useState } from 'react'

// Mini simulación del hero: un solo equipo contra su patrón. Valores de ejemplo.
const BASE = 1100
const N = 48
const WIN = 6
const LIMIT = 0.2
const W = 320
const H = 96

const noise = (n) => (Math.random() * 2 - 1) * n
const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length
const fresh = () => ({ data: Array.from({ length: N }, () => BASE + noise(40)), age: -1, streak: 0, alerted: false })

function next(s) {
  const age = s.age >= 0 ? s.age + 1 : -1
  const f = age < 0 ? 0 : Math.min(1, age / 10)
  const data = [...s.data.slice(1), BASE * (1 + 0.4 * f) + noise(40)]
  const streak = avg(data.slice(-WIN)) > BASE * (1 + LIMIT) ? s.streak + 1 : 0
  return { data, age, streak, alerted: s.alerted || streak >= 3 }
}

const x = (i) => (i * W) / (N - 1)
const y = (v) => H - ((v - 700) / 1000) * H
const statusText = { ok: 'Normal', watch: 'Analizando', alert: 'Anomalía' }

export default function HeroPulse() {
  const [s, setS] = useState(fresh)

  useEffect(() => {
    const id = setInterval(() => setS(next), 450)
    return () => clearInterval(id)
  }, [])

  const pct = Math.round((avg(s.data.slice(-WIN)) / BASE - 1) * 100)
  const status = s.alerted ? 'alert' : pct > LIMIT * 50 ? 'watch' : 'ok'
  const line = s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <div className="card pulse">
      <div className="pulse-head">
        <span>Aire acondicionado · Habitación</span>
        <span className={`pill ${status}`}>{statusText[status]}</span>
      </div>
      <p className="pulse-num" aria-live="off">
        {Math.round(s.data[N - 1]).toLocaleString('es-CO')}<small>W</small>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className={`spark ${status}`} aria-hidden="true">
        <rect x="0" width={W} y={y(BASE * (1 + LIMIT))} height={y(BASE * (1 - LIMIT)) - y(BASE * (1 + LIMIT))} className="band" />
        <path d={line} />
        <circle cx={x(N - 1)} cy={y(s.data[N - 1])} r="3.5" />
      </svg>
      <div className="pulse-foot">
        <span className="mono">Patrón 1.100 W · {pct >= 0 ? '+' : ''}{pct}%</span>
        {s.age < 0 ? (
          <button className="btn btn-line btn-sm" onClick={() => setS((p) => ({ ...p, age: 0 }))}>Simular filtro sucio</button>
        ) : s.alerted ? (
          <button className="btn btn-line btn-sm" onClick={() => setS(fresh())}>Reiniciar</button>
        ) : (
          <button className="btn btn-line btn-sm" disabled>Detectando…</button>
        )}
      </div>
      {s.alerted && (
        <div className="toast" role="status">
          <div className="toast-top"><span className="logo-dot" />TurbAI · ahora</div>
          <b>El aire está consumiendo {pct}% más de lo normal</b>
          <p>Suele ser un filtro sucio. Revísalo antes de que falle. <a href="#demo">Ver la demo completa →</a></p>
        </div>
      )}
    </div>
  )
}
