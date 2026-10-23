import { useState } from 'react'
import { cop } from '../sim.js'

const MAX = 600000
// Escenarios dentro del rango de 5–15% citado por la IEA para medición inteligente y controles digitales.
const levels = [[0.05, 'Conservador'], [0.1, 'Medio'], [0.15, 'Alto']]

export default function Savings() {
  const [bill, setBill] = useState(180000)
  const [p, setP] = useState(0.1)
  const saving = bill * p
  return (
    <div className="card savings">
      <label htmlFor="bill">¿Cuánto pagas de luz al mes?</label>
      <output htmlFor="bill" className="savings-bill">{cop(bill)}</output>
      <input
        id="bill" type="range" min="50000" max={MAX} step="10000" value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <div className="seg" role="group" aria-label="Escenario de ahorro">
        {levels.map(([v, l]) => (
          <button key={v} className={p === v ? 'on' : ''} aria-pressed={p === v} onClick={() => setP(v)}>
            {l} · {v * 100}%
          </button>
        ))}
      </div>
      <div className="bars" aria-hidden="true">
        <div className="bar"><span>Hoy</span><i style={{ width: `${(bill / MAX) * 100}%` }} /></div>
        <div className="bar after"><span>Con TurbAI</span><i style={{ width: `${((bill - saving) / MAX) * 100}%` }} /></div>
      </div>
      <div className="savings-out">
        <div><span>Ahorro al mes</span><strong>{cop(saving)}</strong></div>
        <div><span>En un año</span><strong>{cop(saving * 12)}</strong></div>
      </div>
      <p className="caption">Escenarios dentro del rango de 5–15% que estima la IEA para medición inteligente. No es una promesa de ahorro.</p>
    </div>
  )
}
