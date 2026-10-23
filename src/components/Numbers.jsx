import { useEffect, useRef, useState } from 'react'
import { numbers } from '../data.js'

// Anima cada número dentro del texto (p. ej. "$517 → $1.706 billones") cuando entra en pantalla
function CountUp({ text }) {
  const ref = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(1); return }
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1400)
        setP(1 - Math.pow(1 - k, 3))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  const out = text.replace(/\d+(?:\.\d+)?/g, (m) => {
    const dec = (m.split('.')[1] || '').length
    // Un punto con tres cifras detrás es separador de miles: 1.706 = mil setecientos seis
    if (dec === 3) return Math.round(parseFloat(m.replace('.', '')) * p).toLocaleString('es-CO')
    return (parseFloat(m) * p).toFixed(dec)
  })
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">{out}</span>
    </>
  )
}

export default function Numbers() {
  return (
    <dl className="nums">
      {numbers.map((m) => (
        <div key={m.value}>
          <dt><CountUp text={m.value} /></dt>
          <dd>{m.text} <cite>{m.source}</cite></dd>
        </div>
      ))}
    </dl>
  )
}
