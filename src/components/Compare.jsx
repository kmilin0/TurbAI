import { useState } from 'react'
import { compare } from '../data.js'

export default function Compare() {
  const [col, setCol] = useState(null)
  const hl = (i) => (col === i ? 'hl-col' : '')
  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><span className="sr-only">Alternativa</span></th>
              {compare.cols.map((c, i) => (
                <th key={c} className={hl(i)}>
                  <button aria-pressed={col === i} onClick={() => setCol(col === i ? null : i)}>{c}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.rows.map((r) => (
              <tr key={r.name} className={r.highlight ? 'me' : ''}>
                <th scope="row">{r.name}{r.note && <small>{r.note}</small>}</th>
                {r.has.map((h, i) => (
                  <td key={i} className={hl(i)}>
                    <span className={`dot ${h ? 'yes' : ''}`} role="img" aria-label={h ? 'Sí' : 'No'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="def" aria-live="polite">
        {col === null
          ? 'Toca una columna para ver qué significa.'
          : <><b>{compare.cols[col]}:</b> {compare.defs[col]}</>}
      </p>
      <p className="caption">Comparación general por categoría, según la información pública de cada producto. Puede variar según el plan o el país.</p>
    </>
  )
}
