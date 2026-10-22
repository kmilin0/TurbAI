import { useState } from 'react'
import { cop } from '../sim.js'

// Rango de ahorro de 5–15% citado por la IEA para medición inteligente y controles digitales.
export default function Savings() {
  const [bill, setBill] = useState(180000)
  const low = bill * 0.05
  const high = bill * 0.15
  return (
    <div className="savings">
      <label htmlFor="bill">¿Cuánto pagas de luz al mes?</label>
      <output htmlFor="bill" className="savings-bill">{cop(bill)}</output>
      <input
        id="bill" type="range" min="50000" max="600000" step="10000" value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <div className="savings-out">
        <div>
          <span>Podrías ahorrar al mes</span>
          <strong>{cop(low)} – {cop(high)}</strong>
        </div>
        <div>
          <span>En un año</span>
          <strong>{cop(low * 12)} – {cop(high * 12)}</strong>
        </div>
      </div>
      <p className="caption">Estimación con el rango de 5–15% de la IEA para medición inteligente. No es una promesa de ahorro.</p>
    </div>
  )
}
