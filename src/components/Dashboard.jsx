import { useEffect, useRef, useState } from 'react'
import { useHomeSim, clock, cop, TARIFF, HOURS } from '../sim.js'

const W = 720
const H = 220
const PAD = 8

function LiveChart({ series }) {
  const max = Math.max(2400, ...series.map((p) => p.v)) * 1.1
  const x = (i) => PAD + (i * (W - PAD * 2)) / Math.max(1, series.length - 1)
  const y = (v) => H - PAD - (v / max) * (H - PAD * 2)
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  const area = `${line} L${x(series.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z`
  const last = series[series.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Potencia total de la casa en tiempo real">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} className="dash-grid" />
      ))}
      <path d={area} className="dash-area" />
      <path d={line} className="dash-line" fill="none" vectorEffect="non-scaling-stroke" />
      {series.map((p, i) => p.alert && (
        <line key={i} x1={x(i)} x2={x(i)} y1={PAD} y2={H - PAD} className="dash-alert-mark" vectorEffect="non-scaling-stroke" />
      ))}
      {last && <circle cx={x(series.length - 1)} cy={y(last.v)} r="5" className="dash-head" />}
    </svg>
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

const statusText = { ok: 'Normal', watch: 'En observación', alert: 'Revisar', off: 'Apagado' }

function DeviceCard({ d, onToggle }) {
  const pct = d.on ? Math.round(d.ratio * 100) : 0
  return (
    <li className={`dev is-${d.status}`}>
      <div className="dev-top">
        <div>
          <b>{d.name}</b>
          <small>{d.room}</small>
        </div>
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
        {d.on ? <>Patrón aprendido {d.expected} W · {pct >= 0 ? '+' : ''}{pct}%</> : 'Sin consumo'}
      </small>
    </li>
  )
}

function AlertCard({ a, dev, onTech, onResolve }) {
  const pct = Math.round(a.ratio * 100)
  if (a.stage === 'done') {
    return (
      <li className="alert done">
        <b>{dev.name}: resuelto</b>
        <p>Detectado a las {clock(a.minutes)}, reparado a las {clock(a.doneAt)} antes de convertirse en emergencia.</p>
      </li>
    )
  }
  return (
    <li className="alert">
      <div className="alert-top"><span className="notif-logo">T</span>TurbAI · {clock(a.minutes)}</div>
      <b>{dev.name} está consumiendo distinto</b>
      <p>Va {pct}% por encima de su patrón: {dev.fault.cause}.</p>
      <p className="alert-advice">{dev.fault.advice}</p>
      {a.stage === 'new' ? (
        <button className="btn btn-primary btn-small" onClick={() => onTech(a.id)}>Pedir {dev.fault.tech.toLowerCase()}</button>
      ) : (
        <div className="alert-tech">
          <span><b>{a.techName}</b> · {dev.fault.tech} · llega en {a.eta} min</span>
          <button className="btn btn-line btn-small" onClick={() => onResolve(a.id)}>Marcar como reparado</button>
        </div>
      )}
    </li>
  )
}

export default function Dashboard() {
  const sim = useHomeSim()
  const box = useRef(null)
  const [full, setFull] = useState(false)

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
            {[[0, 'Pausa'], [1, '1×'], [4, '4×']].map(([v, l]) => (
              <button key={v} className={sim.speed === v ? 'on' : ''} aria-pressed={sim.speed === v} onClick={() => sim.setSpeed(v)}>{l}</button>
            ))}
          </div>
          <button className="btn btn-ghost btn-small" onClick={sim.reset}>Reiniciar</button>
          {document.fullscreenEnabled && (
            <button className="btn btn-ghost btn-small" onClick={toggleFull}>{full ? 'Salir' : 'Pantalla completa'}</button>
          )}
        </div>
      </div>

      <div className="scenarios">
        <span>Provoca una falla:</span>
        {scenarios.map((d) => (
          <button key={d.id} className="chip" disabled={d.faulty} onClick={() => sim.injectFault(d.id)}>
            {d.faulty ? '● ' : ''}{d.fault.scenario}
          </button>
        ))}
      </div>

      <dl className="kpis">
        <div>
          <dt>Potencia ahora</dt>
          <dd><strong>{(sim.current / 1000).toFixed(2)}</strong> kW</dd>
        </div>
        <div>
          <dt>Consumo de hoy</dt>
          <dd><strong>{sim.kwh.toFixed(1)}</strong> kWh</dd>
        </div>
        <div>
          <dt>Factura proyectada</dt>
          <dd><strong>{cop(sim.projected)}</strong> /mes</dd>
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
            <b>Consumo total en vivo</b>
            <small>Última hora simulada · líneas ámbar = anomalía detectada</small>
          </div>
          <LiveChart series={sim.series} />
        </div>
        <div className="panel feed">
          <div className="panel-head">
            <b>Alertas {open > 0 && <span className="badge">{open}</span>}</b>
            <small>Lo que TurbAI te diría al celular</small>
          </div>
          <ul aria-live="polite">
            {sim.alerts.length === 0 && (
              <li className="empty">Todo en orden. TurbAI está comparando cada equipo contra su propio historial. Provoca una falla para verla en acción.</li>
            )}
            {sim.alerts.map((a) => (
              <AlertCard key={a.id} a={a} dev={byId[a.devId]} onTech={sim.requestTech} onResolve={sim.resolve} />
            ))}
          </ul>
        </div>
      </div>

      <ul className="devs">
        {sim.devices.map((d) => <DeviceCard key={d.id} d={d} onToggle={sim.toggle} />)}
      </ul>

      <p className="dash-note">
        Simulación con valores de ejemplo, tarifa ilustrativa de {cop(TARIFF)}/kWh y {HOURS} h de uso al día para proyectar la factura. No corresponde a mediciones reales ni a técnicos reales.
      </p>
    </div>
  )
}
