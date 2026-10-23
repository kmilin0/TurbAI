import { useEffect, useRef, useState } from 'react'

// Serie ilustrativa: consumo estable y luego desviación del patrón habitual.
const W = 640
const H = 260
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
const path = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
const ghost = path(series)

const steps = [
  { day: 10, text: 'El aire acondicionado mantiene un patrón de consumo estable.' },
  { day: 19, text: 'Su consumo empieza a alejarse del patrón habitual.' },
  { day: 21, text: 'TurbAI detecta la anomalía comparando contra el histórico del equipo.' },
  { day: 23, text: 'Alerta: “Tu aire acondicionado está consumiendo distinto a lo normal.”' },
  { day: 25, text: 'Recomienda una revisión antes de que ocurra una falla mayor.' },
  { day: 29, text: 'El usuario agenda mantenimiento a tiempo y evita una emergencia.' },
]
const stepAt = (day) => (day < 18 ? 0 : day < DETECT ? 1 : Math.min(5, 2 + Math.floor((day - DETECT) / 2)))
const clamp = (v) => Math.max(0, Math.min(N - 1, v))

export default function Chart() {
  const [day, setDay] = useState(N - 1)
  const [playing, setPlaying] = useState(false)
  const svg = useRef(null)

  useEffect(() => {
    if (!playing) return
    if (day >= N - 1) { setPlaying(false); return }
    const t = setTimeout(() => setDay((d) => d + 1), 140)
    return () => clearTimeout(t)
  }, [playing, day])

  // Se reproduce sola la primera vez que entra en pantalla
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      setDay(0)
      setPlaying(true)
    }, { threshold: 0.5 })
    io.observe(svg.current)
    return () => io.disconnect()
  }, [])

  const replay = () => { setDay(0); setPlaying(true) }
  const go = (d) => { setPlaying(false); setDay(clamp(d)) }

  const fromPointer = (e) => {
    const r = svg.current.getBoundingClientRect()
    return Math.round(((((e.clientX - r.left) / r.width) * W - PAD) / (W - PAD * 2)) * (N - 1))
  }

  const onKey = (e) => {
    const map = { ArrowRight: day + 1, ArrowUp: day + 1, ArrowLeft: day - 1, ArrowDown: day - 1, Home: 0, End: N - 1 }
    if (e.key in map) { e.preventDefault(); go(map[e.key]) }
  }

  const detected = day >= DETECT
  const stepIdx = stepAt(day)

  return (
    <div className="example-in">
      <ol className="story-steps">
        {steps.map((s, i) => (
          <li key={s.text}>
            <button className={i === stepIdx ? 'on' : i < stepIdx ? 'past' : ''} onClick={() => go(s.day)}>
              <span>0{i + 1}</span>{s.text}
            </button>
          </li>
        ))}
      </ol>
      <div className="card story">
        <div className="story-head">
          <div>
            <b>Aire acondicionado · habitación</b>
            <span className="mono muted">Día {day + 1} · {series[day].toFixed(2)} kWh</span>
          </div>
          <button className="btn btn-line btn-sm" onClick={replay}>▶ Reproducir</button>
        </div>
        <svg
          ref={svg} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="slider"
          aria-label="Día de la serie" aria-valuemin={1} aria-valuemax={N} aria-valuenow={day + 1}
          aria-valuetext={`Día ${day + 1}: ${steps[stepIdx].text}`}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); go(fromPointer(e)) }}
          onPointerMove={(e) => { if (e.buttons || e.pointerType === 'mouse') go(fromPointer(e)) }}
          onKeyDown={onKey}
        >
          <rect x={PAD} y={y(1.45)} width={W - PAD * 2} height={y(0.95) - y(1.45)} className="band" />
          <text x={PAD + 6} y={y(0.95) + 16} className="axis">Patrón habitual</text>
          <path d={ghost} className="ghost" />
          <path d={path(series.slice(0, day + 1))} className={`line ${detected ? 'hot' : ''}`} />
          {detected && (
            <g>
              <line x1={x(DETECT)} x2={x(DETECT)} y1={PAD - 6} y2={H - PAD} className="detect-line" />
              <circle cx={x(DETECT)} cy={y(series[DETECT])} r="6" className="detect-dot" />
              <text x={x(DETECT) - 8} y={PAD + 6} textAnchor="end" className="detect-text">Anomalía detectada</text>
            </g>
          )}
          <circle cx={x(day)} cy={y(series[day])} r="6" className="head" />
        </svg>
        <p className="caption">Arrastra sobre la gráfica o usa las flechas del teclado. Patrón ilustrativo, no es una medición real.</p>
      </div>
    </div>
  )
}
