import { useEffect, useState } from 'react'

// Serie ilustrativa: consumo estable y luego desviación del patrón habitual.
const W = 640
const H = 240
const PAD = 28
const N = 30
const series = Array.from({ length: N }, (_, i) => {
  const base = 1.2 + Math.sin(i * 0.9) * 0.06
  const drift = i >= 18 ? (i - 17) * 0.085 : 0
  return base + drift
})
const DETECT = 21
const max = 2.8
const x = (i) => PAD + (i * (W - PAD * 2)) / (N - 1)
const y = (v) => H - PAD - (v / max) * (H - PAD * 2)

const steps = [
  'El aire acondicionado mantiene un patrón de consumo estable.',
  'Su consumo empieza a alejarse del patrón habitual.',
  'TurbAI detecta la anomalía comparando contra el histórico del equipo.',
  'Alerta: "Tu aire acondicionado está consumiendo distinto a lo normal."',
  'Recomienda una revisión antes de que ocurra una falla mayor.',
  'El usuario agenda mantenimiento a tiempo y evita una emergencia.',
]

export default function Chart() {
  const [day, setDay] = useState(N - 1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setDay((d) => {
        if (d >= N - 1) {
          setPlaying(false)
          return d
        }
        return d + 1
      })
    }, 150)
    return () => clearInterval(t)
  }, [playing])

  const pts = series.slice(0, day + 1)
  const line = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const detected = day >= DETECT
  const stepIdx = day < 18 ? 0 : day < DETECT ? 1 : Math.min(5, 2 + Math.floor((day - DETECT) / 2))

  const replay = () => {
    setDay(0)
    setPlaying(true)
  }

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <strong>Aire acondicionado · habitación principal</strong>
          <span className="muted">Consumo diario, últimos 30 días</span>
        </div>
        <button className="btn btn-line" onClick={replay}>Reproducir</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfica ilustrativa de consumo con una anomalía detectada">
        <rect x={PAD} y={y(1.45)} width={W - PAD * 2} height={y(0.95) - y(1.45)} className="band" />
        <text x={PAD + 4} y={y(0.95) + 16} className="axis">Patrón habitual</text>
        <path d={line} className="line" fill="none" />
        {detected && (
          <g>
            <line x1={x(DETECT)} x2={x(DETECT)} y1={PAD - 6} y2={H - PAD} className="detect-line" />
            <circle cx={x(DETECT)} cy={y(series[DETECT])} r="6" className="detect-dot" />
            <text x={x(DETECT) - 8} y={PAD + 6} textAnchor="end" className="detect-text">Anomalía detectada</text>
          </g>
        )}
        <circle cx={x(day)} cy={y(series[day])} r="4" className="head-dot" />
      </svg>
      <input
        type="range" min="0" max={N - 1} value={day}
        onChange={(e) => { setPlaying(false); setDay(Number(e.target.value)) }}
        aria-label="Día de la serie"
      />
      <p className="step"><span className="step-n">{stepIdx + 1}</span>{steps[stepIdx]}</p>
      <p className="muted small">Patrón ilustrativo — no corresponde a una medición real.</p>
    </div>
  )
}
