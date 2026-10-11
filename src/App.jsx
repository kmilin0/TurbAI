import { useEffect, useState } from 'react'
import Chart from './components/Chart.jsx'
import Phone from './components/Phone.jsx'
import {
  nav, questions, steps, stats, compare, revenue,
  jobs, market, phases, mvp, faq, sources,
} from './data.js'

function Waitlist({ dark }) {
  const [sent, setSent] = useState(false)
  if (sent) {
    return <p className={`waitlist-ok ${dark ? 'on-dark' : ''}`}>Listo. Te escribiremos cuando el MVP esté disponible.</p>
  }
  return (
    <form className={`waitlist ${dark ? 'on-dark' : ''}`} onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <label htmlFor={dark ? 'mail-2' : 'mail-1'} className="sr-only">Correo electrónico</label>
      <input id={dark ? 'mail-2' : 'mail-1'} type="email" required placeholder="tu@correo.com" />
      <button className="btn btn-primary" type="submit">Unirme a la lista</button>
    </form>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`nav ${scrolled ? 'solid' : ''}`}>
        <div className="wrap nav-in">
          <a href="#top" className="brand">TurbAI<span> Home</span></a>
          <nav className={open ? 'open' : ''}>
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>{n.label}</a>
            ))}
          </nav>
          <a href="#lista" className="btn btn-small nav-cta">Lista de espera</a>
          <button className="burger" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero con foto a sangre, estilo Ting / SPAN */}
        <section className="hero">
          <img src="/img/sala.jpg" alt="" className="hero-img" />
          <div className="hero-shade" />
          <div className="wrap hero-in">
            <div className="hero-copy">
              <h1>Tu casa te avisa antes de que se dañe.</h1>
              <p>
                TurbAI Home aprende cómo consume tu casa y te avisa cuando algo se sale de lo normal:
                antes de la factura sorpresa, antes de la falla, antes de la emergencia.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#lista">Unirme a la lista de espera</a>
                <a className="btn btn-link-light" href="#como-funciona">Ver cómo funciona →</a>
              </div>
            </div>
            <div className="notif" role="img" aria-label="Ejemplo de notificación de TurbAI">
              <div className="notif-top"><span className="notif-logo">T</span>TurbAI Home<time>ahora</time></div>
              <b>El aire de la habitación está consumiendo distinto</b>
              <p>Lleva 5 días un 34% por encima de su promedio. Te recomendamos una revisión antes de que falle.</p>
            </div>
          </div>
        </section>

        {/* Problema: frases grandes, sin tarjetas */}
        <section className="problem">
          <div className="wrap">
            <p className="kicker">El problema</p>
            <ul className="questions">
              {questions.map((q) => <li key={q}>{q}</li>)}
            </ul>
            <p className="problem-end">
              Hoy la casa se entera tarde: cuando ya llegó la factura, cuando ya se dañó el equipo,
              cuando ya hay que llamar a alguien de urgencia.
            </p>
          </div>
        </section>

        {/* Cómo funciona: 3 pasos + app */}
        <section id="como-funciona" className="how">
          <div className="wrap how-in">
            <div>
              <p className="kicker">Cómo funciona</p>
              <h2>Mide. Aprende lo normal. Te avisa.</h2>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="step-num">{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="how-phone">
              <Phone />
              <p className="caption">Maqueta del MVP con valores de ejemplo.</p>
            </div>
          </div>
        </section>

        {/* Alterna foto / texto, estilo SPAN */}
        <section className="split">
          <div className="wrap split-in">
            <img src="/img/medidores.jpg" alt="Hilera de medidores de energía en una pared" loading="lazy" />
            <div>
              <p className="kicker">La oportunidad</p>
              <h2>Los datos ya existen. Nadie te los explica.</h2>
              <p className="body">
                Medidores, facturas y sensores ya generan información sobre tu casa. Lo que falta es
                alguien que la lea a tiempo y te diga qué hacer, en palabras simples.
              </p>
              <dl className="facts">
                {stats.map((s) => (
                  <div key={s.value}>
                    <dt>{s.value}</dt>
                    <dd>{s.text} <cite>{s.source}</cite></dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="ejemplo" className="example">
          <div className="wrap">
            <div className="example-head">
              <div>
                <p className="kicker">Un ejemplo</p>
                <h2>El aire acondicionado que avisó a tiempo</h2>
              </div>
              <p className="body">
                Durante semanas consume lo mismo. Un día empieza a subir. TurbAI lo nota comparando contra
                su propio historial, te avisa y te sugiere una revisión. Arreglarlo a tiempo cuesta menos
                que arreglarlo roto.
              </p>
            </div>
            <Chart />
          </div>
        </section>

        <section id="tecnicos" className="split reverse">
          <div className="wrap split-in">
            <img src="/img/tecnico.jpg" alt="Técnico electricista revisando una caja eléctrica" loading="lazy" />
            <div>
              <p className="kicker">Red de técnicos</p>
              <h2>La IA detecta. Las personas resuelven.</h2>
              <p className="body">
                TurbAI no reemplaza al técnico: hace que llegue antes de que el problema sea una emergencia.
                Cada alerta que necesita una mano termina en un servicio real, hecho por una persona.
              </p>
              <div className="jobs">
                <div>
                  <h3>En la red de TurbAI</h3>
                  <ul>{jobs.field.map((j) => <li key={j}>{j}</li>)}</ul>
                </div>
                <div>
                  <h3>En el equipo de TurbAI</h3>
                  <ul>{jobs.tech.map((j) => <li key={j}>{j}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="compare">
          <div className="wrap">
            <p className="kicker">Qué nos hace distintos</p>
            <h2>No medimos más. Explicamos y anticipamos.</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th><span className="sr-only">Alternativa</span></th>{compare.cols.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {compare.rows.map((r) => (
                    <tr key={r.name} className={r.highlight ? 'hl' : ''}>
                      <th scope="row">{r.name}</th>
                      {r.has.map((h, i) => (
                        <td key={i}>{h ? <span className="yes" aria-label="Sí" /> : <span className="no" aria-label="No" />}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="split">
          <div className="wrap split-in">
            <img src="/img/cocina.jpg" alt="Pareja cocinando en casa" loading="lazy" />
            <div>
              <p className="kicker">Modelo de negocio</p>
              <h2>Un mismo dato, cinco formas de sostener el proyecto</h2>
              <ol className="revenue">
                {revenue.map((r) => (
                  <li key={r.title}><b>{r.title}</b><span>{r.text}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="market">
          <div className="wrap market-in">
            <div>
              <p className="kicker">Mercado</p>
              <h2>Empezamos en hogares urbanos. El problema es de todas partes.</h2>
            </div>
            <dl>
              {market.map((m) => (
                <div key={m.value}>
                  <dt>{m.value}</dt>
                  <dd>{m.text} <cite>{m.source}</cite></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="hoja-de-ruta" className="roadmap">
          <div className="wrap">
            <p className="kicker">Hoja de ruta</p>
            <h2>Empezamos pequeño. Crecemos por fases.</h2>
            <ol className="phases">
              {phases.map((p, i) => (
                <li key={p.name} className={i === 0 ? 'now' : ''}>
                  <span className="phase-tag">{p.tag}</span>
                  <h3>TurbAI {p.name}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ol>
            <div className="mvp">
              <h3>Lo que incluye el MVP</h3>
              <ul>{mvp.map((m) => <li key={m}>{m}</li>)}</ul>
              <p className="caption">Las fases 2 a 5 son visión de producto a mediano y largo plazo, no funcionalidad ya construida.</p>
            </div>
          </div>
        </section>

        <section id="preguntas" className="faq">
          <div className="wrap faq-in">
            <h2>Preguntas frecuentes</h2>
            <div>
              {faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="lista" className="final">
          <div className="wrap">
            <h2>De una casa que reacciona a una casa que previene.</h2>
            <p>Déjanos tu correo y te contamos cuando TurbAI Monitor esté listo para probar.</p>
            <Waitlist dark />
            <p className="caption on-dark">Formulario de demostración: el correo no se envía a ningún servidor.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-in">
          <div>
            <a href="#top" className="brand">TurbAI<span> Home</span></a>
            <p>Proyecto de emprendimiento en Ingeniería de Software. © 2026.</p>
          </div>
          <div>
            <h4>Fuentes</h4>
            <ul>
              {sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer noopener">{s.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Fotografías</h4>
            <p>Imágenes de <a href="https://unsplash.com" target="_blank" rel="noreferrer noopener">Unsplash</a>, bajo la Licencia Unsplash.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
