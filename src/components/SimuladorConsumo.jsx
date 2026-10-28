import { useState } from 'react'
import { cop, TARIFF } from '../sim.js'

// Potencias promedio de ejemplo (W). Las horas son por día.
const CATALOG = [
  { id: 'aire', name: 'Aire acondicionado', watts: 1100, hours: 8, max: 16 },
  { id: 'nevera', name: 'Nevera', watts: 84, hours: 24, max: 24, fixed: true },
  { id: 'ducha', name: 'Ducha eléctrica', watts: 3500, hours: 0.5, max: 3, step: 0.25 },
  { id: 'lavadora', name: 'Lavadora', watts: 450, hours: 1, max: 6, step: 0.5 },
  { id: 'tv', name: 'Televisor', watts: 95, hours: 5, max: 16 },
  { id: 'pc', name: 'Computador', watts: 120, hours: 6, max: 16 },
  { id: 'ventilador', name: 'Ventilador', watts: 60, hours: 6, max: 16 },
  { id: 'luces', name: 'Iluminación', watts: 140, hours: 6, max: 16 },
  { id: 'microondas', name: 'Microondas', watts: 1200, hours: 0.3, max: 2, step: 0.1 },
  { id: 'plancha', name: 'Plancha', watts: 1000, hours: 0.5, max: 3, step: 0.25 },
]

const ON_BY_DEFAULT = ['aire', 'nevera', 'tv', 'luces']
const kwhMonth = (w, h) => (w * h * 30) / 1000

export default function SimuladorConsumo() {
  const [rows, setRows] = useState(() => CATALOG.map((d) => ({ ...d, on: ON_BY_DEFAULT.includes(d.id) })))
  const [tariff, setTariff] = useState(TARIFF)
  const [goal, setGoal] = useState(200000)

  const update = (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const active = rows
    .filter((r) => r.on)
    .map((r) => ({ ...r, kwh: kwhMonth(r.watts, r.hours), cost: kwhMonth(r.watts, r.hours) * tariff }))
  const total = active.reduce((s, r) => s + r.cost, 0)
  const totalKwh = active.reduce((s, r) => s + r.kwh, 0)
  const ranking = [...active].sort((a, b) => b.cost - a.cost)

  // El equipo más caro cuyas horas sí se pueden reducir (la nevera no)
  const top = ranking.find((r) => !r.fixed && r.hours >= 1)
  const savePerHour = top ? (top.watts / 1000) * tariff * 30 : 0

  const diff = total - goal
  const pct = Math.min(100, goal > 0 ? (total / goal) * 100 : 0)

  return (
    <div className="sim">
      <ul className="sim-list">
        {rows.map((r) => {
          const cost = r.on ? kwhMonth(r.watts, r.hours) * tariff : 0
          return (
            <li key={r.id} className={`card sim-row ${r.on ? '' : 'off'}`}>
              <div className="sim-row-top">
                <div>
                  <b>{r.name}</b>
                  <small>{r.watts} W · {r.fixed ? 'siempre encendida' : `${r.hours} h al día`}</small>
                </div>
                <span className="sim-row-cost">{r.on ? cop(cost) : '—'}</span>
                <button
                  className={`switch ${r.on ? 'on' : ''}`}
                  role="switch"
                  aria-checked={r.on}
                  aria-label={`${r.on ? 'Quitar' : 'Agregar'} ${r.name}`}
                  onClick={() => update(r.id, { on: !r.on })}
                >
                  <span />
                </button>
              </div>
              {r.on && !r.fixed && (
                <input
                  type="range" min="0" max={r.max} step={r.step || 0.5} value={r.hours}
                  aria-label={`Horas al día de ${r.name}`}
                  onChange={(e) => update(r.id, { hours: Number(e.target.value) })}
                />
              )}
            </li>
          )
        })}
      </ul>

      <aside className="card sim-out" aria-live="polite">
        <div className="sim-total">
          <span className="label">Tu consumo estimado al mes</span>
          <strong>{cop(total)}</strong>
          <small>{Math.round(totalKwh)} kWh · tarifa {cop(tariff)}/kWh</small>
        </div>

        <div className="sim-goal">
          <label htmlFor="goal">Mi meta mensual: <b>{cop(goal)}</b></label>
          <input id="goal" type="range" min="50000" max="600000" step="10000" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
          <div className="sim-goalbar"><i className={diff > 0 ? 'over' : ''} style={{ width: `${pct}%` }} /></div>
          <small className={diff > 0 ? 'hot' : ''}>
            {diff > 0 ? `Te pasas ${cop(diff)} de tu meta.` : `Vas ${cop(-diff)} por debajo de tu meta.`}
          </small>
        </div>

        <div>
          <span className="label">Quién se come tu recibo</span>
          <ul className="sim-bars">
            {ranking.length === 0 && <li className="muted">Agrega un electrodoméstico.</li>}
            {ranking.map((r) => (
              <li key={r.id}>
                <span>{r.name}</span>
                <div><i style={{ width: `${(r.cost / total) * 100}%` }} /></div>
                <b>{Math.round((r.cost / total) * 100)}%</b>
              </li>
            ))}
          </ul>
        </div>

        {top && (
          <p className="sim-tip">
            <b>Prueba esto:</b> usar {top.name.toLowerCase()} una hora menos al día te ahorra {cop(savePerHour)} al mes.
          </p>
        )}

        <div className="sim-tariff">
          <label htmlFor="tariff">Tarifa del kWh: <b>{cop(tariff)}</b></label>
          <input id="tariff" type="range" min="500" max="1200" step="10" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} />
          <small>Depende de tu estrato, ciudad y operador. Valores de ejemplo, no es tu factura real.</small>
        </div>
      </aside>
    </div>
  )
}