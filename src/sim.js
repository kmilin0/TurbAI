import { useCallback, useEffect, useRef, useState } from 'react'

// Simulación de una casa para la demo en vivo. Nada de esto es una medición real:
// cada equipo tiene un patrón aprendido (expected) y una falla que lo desvía poco a poco.
export const TARIFF = 850 // COP por kWh, tarifa de ejemplo
export const HOURS = 8 // horas de uso al día que se asumen para proyectar la factura
const TICK_MIN = 1 // minutos simulados por tick
const HISTORY = 60
const RAMP = 12 // ticks hasta que la falla llega a su máxima intensidad
const THRESHOLD = 0.2 // desviación sobre el patrón que se considera anómala
const STREAK = 4 // ticks seguidos por encima del umbral antes de alertar

const noise = (n) => (Math.random() * 2 - 1) * n

export const DEVICES = [
  {
    id: 'aire', name: 'Aire acondicionado', room: 'Habitación', on: true, expected: 1100, window: 8,
    draw: (t, f) => 1100 * (1 + 0.4 * f) + noise(50),
    fault: {
      scenario: 'Filtro sucio en el aire',
      cause: 'el compresor trabaja de más, típico de un filtro sucio o falta de gas',
      advice: 'Limpia el filtro y agenda un mantenimiento preventivo.',
      tech: 'Técnico de refrigeración y aire',
    },
  },
  {
    id: 'nevera', name: 'Nevera', room: 'Cocina', on: true, expected: 84, window: 24,
    draw: (t, f) => ((t % 12) < 6 + 4 * f ? 160 + noise(8) : 8),
    fault: {
      scenario: 'Puerta de la nevera mal sellada',
      cause: 'el motor arranca más seguido de lo normal, como cuando el empaque de la puerta no sella',
      advice: 'Revisa el empaque de la puerta y limpia el condensador.',
      tech: 'Técnico de electrodomésticos',
    },
  },
  {
    id: 'bomba', name: 'Bomba de agua', room: 'Patio', on: true, expected: 75, window: 20,
    draw: (t, f) => ((t % 20) < 2 + 10 * f ? 750 + noise(20) : 0),
    fault: {
      scenario: 'Fuga de agua escondida',
      cause: 'la bomba se enciende aunque nadie está usando agua, señal de una fuga',
      advice: 'Cierra el registro y revisa tuberías, sanitarios y llaves.',
      tech: 'Plomero',
    },
  },
  {
    id: 'lavadora', name: 'Lavadora', room: 'Zona de ropas', on: false, expected: 450, window: 8,
    draw: (t, f) => (450 + Math.sin(t * 1.3) * 120) * (1 + 0.35 * f),
    fault: {
      scenario: 'Lavadora con rodamiento gastado',
      cause: 'el motor necesita más fuerza para girar el tambor, típico de un rodamiento gastado',
      advice: 'Evita cargas pesadas hasta que la revisen.',
      tech: 'Técnico de electrodomésticos',
    },
  },
  { id: 'tv', name: 'Televisor', room: 'Sala', on: true, expected: 95, window: 8, draw: () => 95 + noise(4) },
  { id: 'luces', name: 'Iluminación', room: 'Toda la casa', on: true, expected: 140, window: 8, draw: () => 140 + noise(3) },
]

const TECHS = ['Carlos M.', 'Luisa R.', 'Andrés P.', 'Diana G.']

const monthlyCost = (watts) => (watts * HOURS * 30) / 1000 * TARIFF

export const cop = (n) => `$${Math.round(n).toLocaleString('es-CO')}`

const fresh = () => ({
  t: 0,
  minutes: 18 * 60,
  kwh: 7.8,
  series: [],
  alerts: [],
  seq: 0,
  devs: Object.fromEntries(DEVICES.map((d) => [d.id, { on: d.on, faultAge: -1, hist: [], streak: 0, alerted: false }])),
})

const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0)

function step(s) {
  s.t += 1
  s.minutes += TICK_MIN
  let total = 0
  let fired = false
  for (const d of DEVICES) {
    const st = s.devs[d.id]
    if (!st.on) { st.power = 0; continue }
    if (st.faultAge >= 0) st.faultAge += 1
    const f = st.faultAge < 0 ? 0 : Math.min(1, st.faultAge / RAMP)
    st.power = Math.max(0, d.draw(s.t, f))
    total += st.power
    st.hist.push(st.power)
    if (st.hist.length > d.window) st.hist.shift()
    if (st.hist.length < d.window) continue
    const ratio = avg(st.hist) / d.expected - 1
    st.streak = ratio > THRESHOLD ? st.streak + 1 : 0
    if (st.streak >= STREAK && !st.alerted && d.fault) {
      st.alerted = true
      fired = true
      s.seq += 1
      s.alerts.unshift({ id: s.seq, devId: d.id, minutes: s.minutes, ratio, stage: 'new' })
    }
  }
  s.kwh += (total * TICK_MIN) / 60 / 1000
  s.series.push({ v: total, alert: fired })
  if (s.series.length > HISTORY) s.series.shift()
}

export function useHomeSim() {
  const ref = useRef(null)
  if (!ref.current) {
    ref.current = fresh()
    for (let i = 0; i < HISTORY; i++) step(ref.current)
  }
  const [, render] = useState(0)
  const [speed, setSpeed] = useState(1)
  const refresh = () => render((n) => n + 1)

  useEffect(() => {
    if (!speed) return
    const id = setInterval(() => { step(ref.current); refresh() }, 800 / speed)
    return () => clearInterval(id)
  }, [speed])

  const s = ref.current

  const toggle = useCallback((id) => {
    const st = ref.current.devs[id]
    st.on = !st.on
    st.hist = []
    st.streak = 0
    refresh()
  }, [])

  const injectFault = useCallback((id) => {
    const st = ref.current.devs[id]
    if (st.faultAge >= 0) return
    st.on = true
    st.faultAge = 0
    refresh()
  }, [])

  const requestTech = useCallback((alertId) => {
    const a = ref.current.alerts.find((x) => x.id === alertId)
    a.stage = 'tech'
    a.techName = TECHS[alertId % TECHS.length]
    a.eta = 25 + ((alertId * 17) % 35)
    refresh()
  }, [])

  const resolve = useCallback((alertId) => {
    const a = ref.current.alerts.find((x) => x.id === alertId)
    a.stage = 'done'
    a.doneAt = ref.current.minutes
    const st = ref.current.devs[a.devId]
    Object.assign(st, { faultAge: -1, hist: [], streak: 0, alerted: false })
    refresh()
  }, [])

  const reset = useCallback(() => {
    ref.current = fresh()
    for (let i = 0; i < HISTORY; i++) step(ref.current)
    refresh()
  }, [])

  const devices = DEVICES.map((d) => {
    const st = s.devs[d.id]
    const full = st.hist.length >= d.window
    const mean = avg(st.hist)
    const ratio = st.on && full ? mean / d.expected - 1 : 0
    const status = !st.on ? 'off' : st.alerted ? 'alert' : ratio > THRESHOLD / 2 ? 'watch' : 'ok'
    return { ...d, on: st.on, power: st.power || 0, mean, ratio, status, faulty: st.faultAge >= 0 }
  })

  const current = s.series[s.series.length - 1]?.v || 0
  const extra = devices.reduce((sum, d) => sum + (d.on && d.ratio > 0.1 ? d.mean - d.expected : 0), 0)
  const health = Math.max(0, Math.round(100 - devices.reduce((p, d) => p + (d.ratio > 0.1 ? Math.min(45, d.ratio * 90) : 0), 0)))

  return {
    speed, setSpeed, toggle, injectFault, requestTech, resolve, reset,
    devices,
    series: s.series,
    alerts: s.alerts,
    minutes: s.minutes,
    kwh: s.kwh,
    current,
    projected: monthlyCost(avg(s.series.map((p) => p.v))),
    extraCost: monthlyCost(extra),
    health,
  }
}

export const clock = (m) => {
  const h = Math.floor(m / 60) % 24
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
