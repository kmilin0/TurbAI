import { useEffect, useRef, useState } from 'react'
import HeroPulse from './components/HeroPulse.jsx'
import Problem from './components/Problem.jsx'
import How from './components/How.jsx'
import AcousticScan from './components/AcousticScan.jsx'
import Dashboard from './components/Dashboard.jsx'
import Chart from './components/Chart.jsx'
import Savings from './components/Savings.jsx'
import Numbers from './components/Numbers.jsx'
import Compare from './components/Compare.jsx'
import Roadmap from './components/Roadmap.jsx'
import { nav, tiers, audiences, revenue, jobs, faq, sources } from './data.js'

function Label({ n, children }) {
  return <p className="label"><b>{n}</b>{children}</p>
}

const systemTheme = () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || systemTheme())
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch { /* sin almacenamiento: solo dura la visita */ }
    setTheme(next)
  }
  return (
    <button className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema oscuro'}>
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  )
}

function Waitlist() {
  const [sent, setSent] = useState(false)
  if (sent) return <p className="waitlist-ok">✓ Listo. Te escribiremos cuando el MVP esté disponible.</p>
  return (
    <form className="waitlist" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <label htmlFor="mail" className="sr-only">Correo electrónico</label>
      <input id="mail" type="email" required placeholder="tu@correo.com" autoComplete="email" />
      <button className="btn btn-primary" type="submit">Unirme</button>
    </form>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const progress = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current?.style.setProperty('--p', max > 0 ? window.scrollY / max : 0)
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Las secciones aparecen suavemente al entrar en pantalla
  useEffect(() => {
    const els = document.querySelectorAll('main section:not(.hero) > .wrap')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.08 })
    els.forEach((el) => { el.classList.add('reveal'); io.observe(el) })
    return () => io.disconnect()
  }, [])

  // Marca en el menú la sección que se está leyendo
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('main section[id]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div className="progress" ref={progress} aria-hidden="true" />
      <header className={`nav ${scrolled ? 'solid' : ''}`}>
        <div className="wrap nav-in">
          <a href="#top" className="brand"><i aria-hidden="true" />TurbAI</a>
          <nav className={open ? 'open' : ''} aria-label="Principal">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>{n.label}</a>
            ))}
          </nav>
          <div className="nav-tools">
            <ThemeToggle />
            <a href="#lista" className="btn btn-primary btn-sm nav-cta">Lista de espera</a>
            <button className="burger" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-in">
            <div>
              <p className="label"><span className="logo-dot" />IA + IoT para el hogar · Empieza gratis con tu celular</p>
              <h1>Tu casa te avisa <span>antes de que se dañe.</span></h1>
              <p className="lead">
                TurbAI escucha, mide y entiende tu casa. Detecta una falla antes de que ocurra, te conecta con
                un técnico y verifica con datos que quedó bien arreglada.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#escaneo">Escanear con mi celular</a>
                <a className="btn btn-line" href="#demo">Probar la demo</a>
              </div>
            </div>
            <HeroPulse />
          </div>
        </section>

        <section id="problema">
          <div className="wrap">
            <div className="sec-head">
              <Label n="01">El problema</Label>
              <h2>La casa se entera tarde.</h2>
            </div>
            <Problem />
            <p className="problem-end">
              Hoy nos enteramos cuando ya llegó la factura, cuando ya se dañó el equipo,
              cuando ya hay que llamar a alguien de urgencia.
            </p>
          </div>
        </section>

        <section id="como-funciona">
          <div className="wrap">
            <div className="sec-head">
              <Label n="02">Cómo funciona</Label>
              <h2>Mide. Aprende lo normal. Te avisa.</h2>
            </div>
            <How />
          </div>
        </section>

        <section id="escaneo">
          <div className="wrap">
            <div className="sec-head">
              <Label n="03">Escaneo por sonido · Funciona de verdad</Label>
              <h2>Tu celular ya es un sensor.</h2>
              <p className="lead">
                Neveras, aires, lavadoras y bombas suenan distinto antes de dañarse. TurbAI guarda la huella de
                sonido de cada equipo sano y te avisa cuando cambia. Sin comprar nada.
              </p>
            </div>
            <div className="scan-in">
              <div>
                <ol className="scan-steps">
                  <li><span>01</span>Elige el equipo y acerca el celular a unos 20 cm.</li>
                  <li><span>02</span>Graba su huella sana: 5 segundos con el equipo funcionando bien.</li>
                  <li><span>03</span>Escanea cuando quieras. TurbAI compara las dos huellas y te dice si algo cambió y dónde.</li>
                </ol>
                <p className="scan-tip">
                  <b>Pruébalo ahora:</b> graba un ventilador, luego haz que una hoja de papel roce las aspas y vuelve a
                  escanear. Si hay mucho ruido alrededor, usa los 5 ejemplos: nevera, aire, lavadora, ventilador
                  y bomba de agua.
                </p>
              </div>
              <AcousticScan />
            </div>
          </div>
        </section>

        <section id="demo">
          <div className="wrap">
            <div className="sec-head demo-head">
              <div>
                <Label n="04">Demo en vivo</Label>
                <h2>Tú controlas la casa. TurbAI la vigila.</h2>
              </div>
              <ol>
                <li>Enciende o apaga equipos y mira cómo cambia el consumo.</li>
                <li>Provoca una falla: un filtro sucio, una fuga, una nevera mal cerrada.</li>
                <li>Pide el técnico y mira cómo TurbAI verifica con datos que la reparación funcionó.</li>
              </ol>
            </div>
            <Dashboard />
          </div>
        </section>

        <section id="ejemplo">
          <div className="wrap">
            <div className="sec-head">
              <Label n="05">Un ejemplo</Label>
              <h2>El aire acondicionado que avisó a tiempo.</h2>
              <p className="lead">
                Durante semanas consume lo mismo. Un día empieza a subir. TurbAI lo nota comparando contra su
                propio historial. Arreglarlo a tiempo cuesta menos que arreglarlo roto.
              </p>
            </div>
            <Chart />
          </div>
        </section>

        <section id="niveles">
          <div className="wrap">
            <div className="sec-head">
              <Label n="06">Niveles</Label>
              <h2>Empieza gratis. Crece cuando lo necesites.</h2>
            </div>
            <div className="tiers">
              {tiers.map((t) => (
                <div key={t.name} className={`card tier ${t.free ? 'free' : ''}`}>
                  <p className="label"><b>{t.tag}</b>{t.price}</p>
                  <h3>{t.name}</h3>
                  <ul className="checks">{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  {t.free && <a href="#escaneo">Probar el escaneo →</a>}
                </div>
              ))}
            </div>
            <p className="caption">El escaneo por sonido ya funciona en esta página. Lo demás es parte del MVP en desarrollo; los precios están por validar.</p>
          </div>
        </section>

        <section id="ahorro">
          <div className="wrap save-in">
            <div className="sec-head">
              <Label n="07">Calcula tu ahorro</Label>
              <h2>Lo que no se mide, se paga.</h2>
              <p className="lead">
                Ver el consumo a tiempo y corregir los equipos que se desvían es la forma más simple de bajar
                la factura, y la mejor preparación para una temporada de racionamiento.
              </p>
            </div>
            <Savings />
          </div>
        </section>

        <section id="para-quien">
          <div className="wrap">
            <div className="sec-head">
              <Label n="08">Para quién</Label>
              <h2>De la casa al conjunto residencial.</h2>
            </div>
            <div className="aud">
              {audiences.map((a) => (
                <div key={a.name}>
                  <h3>{a.name}</h3>
                  <p>{a.text}</p>
                  <ul>{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="oportunidad">
          <div className="wrap">
            <div className="sec-head">
              <Label n="09">La oportunidad</Label>
              <h2>Los datos ya existen. Nadie te los explica.</h2>
              <p className="lead">
                Medidores, facturas y sensores ya generan información sobre tu casa. Lo que falta es alguien
                que la lea a tiempo y te diga qué hacer, en palabras simples.
              </p>
            </div>
            <Numbers />
          </div>
        </section>

        <section id="diferencia">
          <div className="wrap">
            <div className="sec-head">
              <Label n="10">Qué nos hace distintos</Label>
              <h2>Otros miden. TurbAI cierra el ciclo.</h2>
              <p className="lead">
                Detectar, explicar, conectar con un técnico y verificar que quedó bien. Y empezar gratis, con el
                celular, en Colombia.
              </p>
            </div>
            <Compare />
          </div>
        </section>

        <section id="tecnicos">
          <div className="wrap two">
            <div className="sec-head">
              <Label n="11">Red de técnicos</Label>
              <h2>La IA detecta. Las personas resuelven. Los datos lo comprueban.</h2>
              <p className="lead">
                Después de cada reparación, TurbAI sigue midiendo el equipo. Si el consumo vuelve a su patrón, la
                reparación queda verificada y el técnico gana reputación. Si no, el técnico regresa sin costo.
              </p>
            </div>
            <div className="jobs">
              <div>
                <p className="label">En la red de TurbAI</p>
                <ul className="tags">{jobs.field.map((j) => <li key={j}>{j}</li>)}</ul>
              </div>
              <div>
                <p className="label">En el equipo de TurbAI</p>
                <ul className="tags">{jobs.tech.map((j) => <li key={j}>{j}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section id="modelo">
          <div className="wrap two">
            <div className="sec-head">
              <Label n="12">Modelo de negocio</Label>
              <h2>Un mismo dato, cinco formas de sostener el proyecto.</h2>
            </div>
            <ol className="list">
              {revenue.map((r, i) => (
                <li key={r.title}><span>0{i + 1}</span><div><b>{r.title}</b><small>{r.text}</small></div></li>
              ))}
            </ol>
          </div>
        </section>

        <section id="hoja-de-ruta">
          <div className="wrap">
            <div className="sec-head">
              <Label n="13">Hoja de ruta</Label>
              <h2>Empezamos pequeño. Crecemos por fases.</h2>
            </div>
            <Roadmap />
          </div>
        </section>

        <section id="preguntas">
          <div className="wrap two">
            <div className="sec-head">
              <Label n="14">Preguntas</Label>
              <h2>Preguntas frecuentes.</h2>
            </div>
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
            <p>Déjanos tu correo y te contamos cuando TurbAI esté listo para probar en tu casa.</p>
            <Waitlist />
            <p className="caption">Formulario de demostración: el correo no se envía a ningún servidor.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-in">
          <div>
            <a href="#top" className="brand"><i aria-hidden="true" />TurbAI</a>
            <p>Proyecto de emprendimiento en Ingeniería de Software. © 2026.</p>
          </div>
          <div>
            <p className="label">Fuentes</p>
            <ul>
              {sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer noopener">{s.name} ↗</a></li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
