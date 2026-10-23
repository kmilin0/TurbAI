import { useEffect, useRef, useState } from 'react'
import { useHomeSim, clock, cop, TARIFF, THRESHOLD, TICK_MIN, VERIFY } from '../sim.js'

const W = 720
const H = 240
const PAD = 10

// Promedio móvil: es lo que TurbAI compara contra el patrón de cada equipo
const rolling = (trace, n) => trace.map((_, i) => {
  const part = trace.slice(Math.max(0, i - n + 1), i + 1)
  return part.reduce((s, p) => s + p.v, 0) / part.length
})

function LiveChart({ points, dev, minutes }) {
  const svg = useRef(null)
  const [hover, setHover] = useState(null)
  const n = points.length
  const shown = dev ? rolling(points, dev.window) : points.map((p) => p.v)
  const top = dev
    ? Math.max(dev.expected * (1 + THRESHOLD) * 2, ...shown) * 1.15
    : Math.max(2400, ...shown) * 1.1
  const x = (i) => PAD + (i * (W - PAD * 2)) / Math.max(1, n - 1)
  const y = (v) => H - PAD - (Math.min(v, top) / top) * (H - PAD * 2)
  const path = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const line = path(shown)
  const hi = hover !== null && hover < n ? hover : null
  const at = hi ?? n - 1

  const onMove = (e) => {
    const r = svg.current.getBoundingClientRect()
    const i = Math.round(((((e.clientX - r.left) / r.width) * W - PAD) / (W - PAD * 2)) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }

  return (
    <div className="live">
      <svg
        ref={svg} viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}
        role="img" aria-label={dev ? `Consumo promedio de ${dev.name} frente a su patrón aprendido` : 'Potencia total de la casa en tiempo real'}
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} className="grid" />
        ))}
        {dev ? (
          <>
            <rect
              x={PAD} width={W - PAD * 2} className="band"
              y={y(dev.expected * (1 + THRESHOLD))}
              height={y(dev.expected * (1 - THRESHOLD)) - y(dev.expected * (1 + THRESHOLD))}
            />
            <line x1={PAD} x2={W - PAD} y1={y(dev.expected * (1 + THRESHOLD))} y2={y(dev.expected * (1 + THRESHOLD))} className="limit" />
            <path d={path(points.map((p) => p.v))} className="raw" />
          </>
        ) : (
          <path d={`${line} L${x(n - 1)},${H - PAD} L${x(0)},${H - PAD} Z`} className="area" />
        )}
        <path d={line} className="line" />
        {points.map((p, i) => p.alert && <line key={i} x1={x(i)} x2={x(i)} y1={PAD} y2={H - PAD} className="mark" />)}
        {hi !== null && <line x1={x(hi)} x2={x(hi)} y1={PAD} y2={H - PAD} className="cursor" />}
        {n > 0 && <circle cx={x(at)} cy={y(shown[at])} r="4.5" className="head" />}
      </svg>
      {hi !== null && (
        <div className="live-tip" style={{ left: `${Math.min(88, Math.max(12, (x(hi) / W) * 100))}%` }}>
          <b>{Math.round(shown[hi])} W</b>
          <span>{clock(minutes - (n - 1 - hi) * TICK_MIN)}</span>
        </div>
      )}
    </div>
  )
}

function Ring({ value }) {
  const r = 26
  const c = 2 * Math.PI * r
  const tone = value >= 85 ? 'good' : value >= 60 ? 'mid' : 'bad'
  return (
    <svg viewBox="0 0 64 64" className={`ring ${tone}`} aria-hidden="true">
      <circle cx="32" cy="32" r={r} className="ring-bg" />
      <circle cx="32" cy="32" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  )
}

const statusText = { ok: 'Normal', watch: 'En observación', alert: 'Revisar', verify: 'Verificando', off: 'Apagado' }

function DeviceCard({ d, selected, onPick, onToggle }) {
  const pct = d.on ? Math.round(d.ratio * 100) : 0
  return (
    <li className={`dev is-${d.status} ${selected ? 'sel' : ''}`}>
      <div className="dev-top">
        <button className="dev-pick" aria-pressed={selected} onClick={() => onPick(d.id)}>
          <b>{d.name}</b>
          <small>{d.room}</small>
        </button>
        <button
          className={`switch ${d.on ? 'on' : ''}`}
          role="switch"
          aria-checked={d.on}
          aria-label={`${d.on ? 'Apagar' : 'Encender'} ${d.name}`}
          onClick={() => onToggle(d.id)}
        >
          <span />
        </button>
      </div>
      <div className="dev-mid">
        <strong>{Math.round(d.power)}<span> W</span></strong>
        <span className="dev-status">{statusText[d.status]}</span>
      </div>
      <div className="dev-meter" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (d.mean / d.expected) * 50)}%` }} />
        <i />
      </div>
      <small className="dev-foot">
        {d.on ? <>Patrón {d.expected} W · {pct >= 0 ? '+' : ''}{pct}%</> : 'Sin consumo'}
      </small>
    </li>
  )
}

function AlertCard({ a, dev, onTech, onRepair, onView }) {
  const pct = Math.round(a.ratio * 100)
  if (a.stage === 'done') {
    const after = Math.round(a.after * 100)
    return (
      <li className="alert done">
        <div className="toast-top">✓ Reparación verificada · {clock(a.doneAt)}</div>
        <b>{dev.name}: volvió a su patrón</b>
        <p>
          Detectado a las {clock(a.minutes)}. Tras la reparación, el consumo quedó en {after >= 0 ? '+' : ''}{after}% de su patrón.
          {' '}{a.techName} suma una reparación verificada a su reputación.
        </p>
      </li>
    )
  }
  if (a.stage === 'verifying') {
    const progress = dev.filled * 0.6 + (a.okStreak / VERIFY) * 0.4
    return (
      <li className="alert verifying">
        <div className="toast-top">Verificando con datos · {clock(a.repairedAt)}</div>
        <b>{a.techName} terminó la reparación</b>
        <div className="rec-bar"><i style={{ width: `${Math.min(100, progress * 100)}%` }} /></div>
        <p>TurbAI sigue midiendo {dev.name.toLowerCase()} hasta confirmar que su consumo volvió a lo normal. Si no vuelve, el técnico regresa sin costo.</p>
      </li>
    )
  }
  return (
    <li className="alert">
      <div className="toast-top"><span className="logo-dot" />TurbAI · {clock(a.minutes)}</div>
      <b>{dev.name} está consumiendo distinto</b>
      <p>Va {pct}% por encima de su patrón: {dev.fault.cause}.</p>
      <p className="alert-advice">{dev.fault.advice}</p>
      <div className="alert-actions">
        {a.stage === 'new' ? (
          <button className="btn btn-primary btn-sm" onClick={() => onTech(a.id)}>Pedir {dev.fault.tech.toLowerCase()}</button>
        ) : (
          <>
            <span className="alert-tech"><b>{a.techName}</b> llega en {a.eta} min</span>
            <button className="btn btn-primary btn-sm" onClick={() => onRepair(a.id)}>El técnico terminó</button>
          </>
        )}
        <button className="btn btn-line btn-sm" onClick={() => onView(a.devId)}>Ver gráfica</button>
      </div>
    </li>
  )
}

export default function Dashboard() {
  const sim = useHomeSim()
  const box = useRef(null)
  const [full, setFull] = useState(false)
  const [sel, setSel] = useState(null)

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === box.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else box.current?.requestFullscreen?.()
  }

  const byId = Object.fromEntries(sim.devices.map((d) => [d.id, d]))
  const dev = sel ? byId[sel] : null
  const scenarios = sim.devices.filter((d) => d.fault)
  const open = sim.alerts.filter((a) => a.stage !== 'done').length

  return (
    <div className="dash" ref={box}>
      <div className="dash-bar">
        <div className="dash-title">
          <span className="live-dot" aria-hidden="true" />
          <b>Casa demo · Apto 502</b>
          <span className="dash-clock">{clock(sim.minutes)}</span>
        </div>
        <div className="dash-controls">
          <div className="seg" role="group" aria-label="Velocidad de la simulación">
            {[[0, 'Pausa'], [1, '1×'], [4, '4×'], [16, '16×']].map(([v, l]) => (
              <button key={v} className={sim.speed === v ? 'on' : ''} aria-pressed={sim.speed === v} onClick={() => sim.setSpeed(v)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-line btn-sm" onClick={sim.reset}>Reiniciar</button>
          {document.fullscreenEnabled && (
            <button className="btn btn-line btn-sm dash-full" onClick={toggleFull}>{full ? 'Salir' : 'Pantalla completa'}</button>
          )}
        </div>
      </div>

      <div className="scenarios">
        <span>Provoca una falla</span>
        {scenarios.map((d) => (
          <button key={d.id} className="chip" disabled={d.faulty || d.status === 'verify'} onClick={() => { sim.injectFault(d.id); setSel(d.id) }}>
            {d.faulty ? '● ' : '+ '}{d.fault.scenario}
          </button>
        ))}
      </div>

      <dl className="kpis">
        <div>
          <dt>Potencia ahora</dt>
          <dd><strong>{(sim.current / 1000).toFixed(2)}</strong>kW</dd>
        </div>
        <div>
          <dt>Consumo de hoy</dt>
          <dd><strong>{sim.kwh.toFixed(1)}</strong>kWh</dd>
        </div>
        <div>
          <dt>Factura proyectada</dt>
          <dd><strong>{cop(sim.projected)}</strong>/mes</dd>
          <small className={sim.extraCost > 1000 ? 'hot' : ''}>
            {sim.extraCost > 1000 ? `${cop(sim.extraCost)} se van en fallas` : 'Sin costos ocultos'}
          </small>
        </div>
        <div className="kpi-health">
          <Ring value={sim.health} />
          <div>
            <dt>Salud del hogar</dt>
            <dd><strong>{sim.health}</strong>/100</dd>
          </div>
        </div>
      </dl>

      <div className="dash-main">
        <div className="panel">
          <div className="panel-head">
            <div>
              <b>{dev ? dev.name : 'Toda la casa'}</b>
              <small>{dev ? `Promedio móvil frente a su patrón de ${dev.expected} W` : 'Potencia total · última hora simulada'}</small>
            </div>
            {dev && <button className="btn btn-line btn-sm" onClick={() => setSel(null)}>← Toda la casa</button>}
          </div>
          <LiveChart points={dev ? dev.trace : sim.series} dev={dev} minutes={sim.minutes} />
          <div className="legend">
            {dev ? (
              <>
                <span><i className="k-band" />Rango normal</span>
                <span><i className="k-limit" />Umbral +{THRESHOLD * 100}%</span>
                <span><i className="k-mark" />Alerta</span>
              </>
            ) : (
              <>
                <span><i className="k-mark" />Anomalía detectada</span>
                <span>Toca un equipo para ver su detalle</span>
              </>
            )}
          </div>
        </div>
        <div className="panel feed">
          <div className="panel-head">
            <div>
              <b>Alertas {open > 0 && <span className="badge">{open}</span>}</b>
              <small>Lo que TurbAI te diría al celular</small>
            </div>
          </div>
          <ul aria-live="polite">
            {sim.alerts.length === 0 && (
              <li className="empty">Todo en orden. TurbAI compara cada equipo contra su propio historial. Provoca una falla para verla en acción.</li>
            )}
            {sim.alerts.map((a) => (
              <AlertCard key={a.id} a={a} dev={byId[a.devId]} onTech={sim.requestTech} onRepair={sim.repair} onView={setSel} />
            ))}
          </ul>
        </div>
      </div>

      <ul className="devs">
        {sim.devices.map((d) => (
          <DeviceCard key={d.id} d={d} selected={sel === d.id} onPick={(id) => setSel(sel === id ? null : id)} onToggle={sim.toggle} />
        ))}
      </ul>

      <p className="dash-note">
        Simulación con valores de ejemplo, tarifa ilustrativa de {cop(TARIFF)}/kWh y horas de uso típicas por equipo. No corresponde a mediciones ni técnicos reales.
      </p>
    </div>
  )
}
