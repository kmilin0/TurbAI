import { useEffect, useRef, useState } from 'react'
import { examples } from '../scanExamples.js'

// Escaneo acústico real: el micrófono saca la "huella" de frecuencias del equipo sano
// y la compara con una nueva grabación. Todo se calcula en el navegador.
const BANDS = 40
const MIN_HZ = 60
const MAX_HZ = 8000
const MIC_MS = 5000
const EX_BASE_MS = 1200
const EX_SCAN_MS = 1800

const devices = ['Ventilador', 'Nevera', 'Aire acondicionado', 'Lavadora']
// Umbrales (% de diferencia) para "revisar" y "anomalía" según la sensibilidad
const SENS = { baja: [22, 40], media: [14, 28], alta: [8, 18] }

const center = (b) => MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, (b + 0.5) / BANDS)

// Agrupa el espectro en bandas logarítmicas, parecido a como escucha el oído
function toBands(power, sampleRate) {
  const binHz = sampleRate / 2 / power.length
  const out = new Array(BANDS).fill(0)
  for (let b = 0; b < BANDS; b++) {
    const lo = MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, b / BANDS)
    const hi = MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, (b + 1) / BANDS)
    const i0 = Math.floor(lo / binHz)
    const i1 = Math.max(i0 + 1, Math.ceil(hi / binHz))
    for (let i = i0; i < i1 && i < power.length; i++) out[b] += power[i]
  }
  return out
}

// Un "cuadro" de sonido simulado de un ejemplo, con algo de variación como en una grabación real
function synth(ex, faulty) {
  return Array.from({ length: BANDS }, (_, b) => {
    const f = center(b)
    return (0.02 + ex.base(f) + (faulty ? ex.fault(f) : 0)) * (0.85 + Math.random() * 0.3)
  })
}

const zones = [
  { name: 'graves', to: 300, hint: 'suele ser el motor o una vibración' },
  { name: 'medios', to: 2000, hint: 'suele ser el flujo de aire, las aspas o el compresor' },
  { name: 'agudos', to: Infinity, hint: 'suele ser un roce, un rodamiento gastado o una fuga de aire' },
]

// Compara la forma de las dos huellas, sin importar el volumen
function compare(base, scan) {
  const sa = base.reduce((s, v) => s + v, 0) || 1
  const sb = scan.reduce((s, v) => s + v, 0) || 1
  const delta = base.map((v, i) => scan[i] / sb - v / sa)
  // La zona es donde apareció sonido nuevo, no donde bajó la proporción
  const byZone = zones.map(() => 0)
  delta.forEach((d, b) => { if (d > 0) byZone[zones.findIndex((z) => center(b) < z.to)] += d })
  return {
    score: Math.round(50 * delta.reduce((s, v) => s + Math.abs(v), 0)),
    zone: zones[byZone.indexOf(Math.max(...byZone))],
    db: 10 * Math.log10(sb / sa),
  }
}

const toDb = (v) => 10 * Math.log10(v + 1e-12)
const W = 640
const H = 200
const P = 6
const BOTTOM = 18

// Bandas donde el escaneo subió más de 3 dB respecto a la huella (comparando la forma, no el volumen)
function risen(base, scan) {
  const sa = base.reduce((s, v) => s + v, 0) || 1
  const sb = scan.reduce((s, v) => s + v, 0) || 1
  return scan.map((v, i) => toDb(v / sb) - toDb(base[i] / sa) > 3)
}

function Spectrum({ base, cur, marks }) {
  const vals = [...(base || []), ...(cur || [])].map(toDb)
  const top = vals.length ? Math.max(...vals) : 0
  // La escala se adapta al rango del sonido (entre 15 y 60 dB) para que se vean las diferencias
  const range = vals.length ? Math.min(60, Math.max(15, top - Math.min(...vals) + 3)) : 50
  const y = (v) => H - BOTTOM - Math.max(0, Math.min(1, (toDb(v) - (top - range)) / range)) * (H - BOTTOM - P)
  const bw = (W - P * 2) / BANDS
  const baseLine = base && base.map((v, b) => `${b ? 'L' : 'M'}${(P + b * bw + bw / 2).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const tick = (hz) => P + (Math.log(hz / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ)) * (W - P * 2)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Huella de frecuencias del equipo">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={P} x2={W - P} y1={P + g * (H - BOTTOM - P)} y2={P + g * (H - BOTTOM - P)} className="grid" />
      ))}
      {cur && cur.map((v, b) => (
        <rect key={b} x={P + b * bw + 1} width={bw - 2} y={y(v)} height={H - BOTTOM - y(v)} rx="1.5" className={`bar-b ${marks?.[b] ? 'hot' : ''}`} />
      ))}
      {baseLine && <path d={baseLine} className="base" />}
      {!base && !cur && <text x={W / 2} y={(H - BOTTOM) / 2} textAnchor="middle" className="empty-t">Graba la huella sana o elige un ejemplo</text>}
      {[[100, '100 Hz'], [500, '500 Hz'], [2000, '2 kHz'], [7000, '7 kHz']].map(([hz, l]) => (
        <text key={hz} x={tick(hz)} y={H - 4} textAnchor="middle" className="axis">{l}</text>
      ))}
    </svg>
  )
}

const verdict = {
  ok: ['Normal', 'Suena igual que cuando estaba sano.'],
  watch: ['Revisar', 'Hay cambios leves. Conviene volver a escucharlo en unos días.'],
  alert: ['Anomalía', 'Suena distinto a su huella sana. Te recomendamos una revisión antes de que falle.'],
}

export default function AcousticScan() {
  const [mode, setMode] = useState('mic')
  const [device, setDevice] = useState(devices[0])
  const [exId, setExId] = useState(null)
  const [bases, setBases] = useState({})
  const [sens, setSens] = useState('media')
  const [rec, setRec] = useState(null)
  const [progress, setProgress] = useState(0)
  const [live, setLive] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const cancel = useRef(null)

  useEffect(() => () => cancel.current?.(), [])

  const ex = mode === 'ejemplos' ? examples.find((e) => e.id === exId) : null
  const key = mode === 'mic' ? device : exId
  const base = key ? bases[key] : null
  const shown = result && result.key === key ? result : null
  const res = shown && base && compare(base, shown.scan)
  const [watchAt, alertAt] = SENS[sens]
  const level = res && (res.score >= alertAt ? 'alert' : res.score >= watchAt ? 'watch' : 'ok')

  // Escucha durante "dur" ms y devuelve el promedio de las bandas, mostrando el espectro en vivo
  const listen = (sample, dur, kind) => {
    setRec(kind)
    const sum = new Array(BANDS).fill(0)
    let n = 0
    return new Promise((resolve) => {
      const t0 = performance.now()
      let raf
      let frame = 0
      const loop = (now) => {
        const b = sample()
        b.forEach((v, i) => { sum[i] += v })
        n += 1
        if (frame++ % 3 === 0) { setLive(b); setProgress(Math.min(1, (now - t0) / dur)) }
        if (now - t0 >= dur) { resolve(sum.map((v) => v / n)); return }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      cancel.current = () => { cancelAnimationFrame(raf); resolve(null) }
    })
  }

  const done = () => {
    cancel.current = null
    setRec(null)
    setLive(null)
    setProgress(0)
  }

  async function recordMic(kind) {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador no permite usar el micrófono aquí. Prueba los ejemplos.')
      return
    }
    let stream
    let ctx
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      ctx = new AudioContext()
    } catch {
      setError('No se pudo usar el micrófono. Revisa el permiso del navegador o prueba los ejemplos.')
      return
    }
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 4096
    analyser.smoothingTimeConstant = 0
    ctx.createMediaStreamSource(stream).connect(analyser)
    const buf = new Float32Array(analyser.frequencyBinCount)
    const sample = () => {
      analyser.getFloatFrequencyData(buf)
      return toBands(buf.map((db) => 10 ** (db / 10)), ctx.sampleRate)
    }
    if (kind === 'base') setResult(null)
    const avg = await listen(sample, MIC_MS, kind)
    stream.getTracks().forEach((t) => t.stop())
    ctx.close()
    done()
    if (!avg) return
    if (kind === 'base') setBases((b) => ({ ...b, [device]: avg }))
    else setResult({ key: device, scan: avg })
  }

  // Un ejemplo se reproduce completo: primero la huella sana y luego el escaneo
  async function playExample(e) {
    setError('')
    setExId(e.id)
    setResult(null)
    const healthy = await listen(() => synth(e, false), EX_BASE_MS, 'base')
    if (!healthy) return done()
    setBases((b) => ({ ...b, [e.id]: healthy }))
    const scan = await listen(() => synth(e, true), EX_SCAN_MS, 'scan')
    done()
    if (scan) setResult({ key: e.id, scan })
  }

  const busy = rec !== null
  const total = mode === 'mic' ? MIC_MS : rec === 'base' ? EX_BASE_MS : EX_SCAN_MS
  const secs = Math.ceil((total * (1 - progress)) / 1000)

  return (
    <div className="card scan">
      <div className="scan-top">
        <div className="seg" role="group" aria-label="Fuente de sonido">
          {[['mic', 'Micrófono'], ['ejemplos', '5 ejemplos']].map(([v, l]) => (
            <button key={v} className={mode === v ? 'on' : ''} aria-pressed={mode === v} disabled={busy} onClick={() => { setMode(v); setError('') }}>{l}</button>
          ))}
        </div>
        {mode === 'mic' && (
          <div className="chips" role="group" aria-label="Equipo a escanear">
            {devices.map((d) => (
              <button key={d} className="chip" aria-pressed={d === device} disabled={busy} onClick={() => setDevice(d)}>{d}</button>
            ))}
          </div>
        )}
      </div>

      {mode === 'ejemplos' && (
        <div className="examples" role="group" aria-label="Ejemplos de escaneo">
          {examples.map((e, i) => (
            <button key={e.id} className="example" aria-pressed={e.id === exId} disabled={busy} onClick={() => playExample(e)}>
              <span className="mono">0{i + 1}</span>
              <b>{e.device}</b>
              <small>{e.title}</small>
            </button>
          ))}
        </div>
      )}

      <div className="spectrum">
        <Spectrum base={base} cur={live || shown?.scan} marks={!live && res && level !== 'ok' ? risen(base, shown.scan) : null} />
        <div className="legend">
          <span><i className="k-base" />Huella sana</span>
          <span><i className="k-bars" />{busy ? 'Escuchando ahora' : 'Último escaneo'}</span>
          {!busy && res && level !== 'ok' && <span><i className="k-hot" />Sonido nuevo</span>}
        </div>
      </div>

      {busy ? (
        <div className="rec" aria-live="polite">
          <div className="rec-bar"><i style={{ width: `${progress * 100}%` }} /></div>
          <span className="mono muted">{rec === 'base' ? 'Grabando huella sana' : 'Escaneando'}… {secs} s</span>
        </div>
      ) : mode === 'mic' ? (
        <div className="scan-actions">
          {!base ? (
            <button className="btn btn-primary" onClick={() => recordMic('base')}>● Grabar huella sana</button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => recordMic('scan')}>Escanear ahora</button>
              <button className="btn btn-line btn-sm" onClick={() => recordMic('base')}>Regrabar huella</button>
            </>
          )}
        </div>
      ) : (
        !ex && <p className="muted small-text">Toca un ejemplo para ver el escaneo completo: huella sana, escaneo y diagnóstico.</p>
      )}

      {error && <p className="scan-error" role="alert">{error}</p>}

      {res && !busy && (
        <div className={`scan-result ${level}`} aria-live="polite">
          <div className="row">
            <strong>{res.score}%</strong>
            <span className="muted">de diferencia con su huella sana</span>
            <span className={`pill ${level}`}>{verdict[level][0]}</span>
          </div>
          <p>
            {ex ? <><b>{ex.device}:</b> {ex.cause}</> : verdict[level][1]}
            {level !== 'ok' && <> El cambio está sobre todo en los {res.zone.name}: {res.zone.hint}.</>}
          </p>
          {ex && (
            <p className="advice">
              {ex.advice}
              {level !== 'ok' && ex.tech && <> Técnico sugerido: {ex.tech.toLowerCase()}.</>}
            </p>
          )}
          <p className="mono small">Volumen {res.db >= 0 ? '+' : ''}{res.db.toFixed(1)} dB frente a la huella</p>
        </div>
      )}

      <div className="scan-foot">
        <span>
          {mode === 'mic'
            ? 'El audio se analiza en tu navegador. No se guarda ni se envía.'
            : 'Ejemplos con perfiles de sonido simulados, para mostrar el análisis sin depender del ruido del lugar.'}
        </span>
        <div className="seg" role="group" aria-label="Sensibilidad">
          {Object.keys(SENS).map((k) => (
            <button key={k} className={sens === k ? 'on' : ''} aria-pressed={sens === k} onClick={() => setSens(k)}>{k}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
