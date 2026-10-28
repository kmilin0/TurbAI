import { useEffect, useRef, useState } from 'react'
import HeroPulse from './components/HeroPulse.jsx'
import Problem from './components/Problem.jsx'
import How from './components/How.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Numbers from './components/Numbers.jsx'
import Compare from './components/Compare.jsx'
import Roadmap from './components/Roadmap.jsx'
import { nav, faq, sources } from './data.js'

function Label({ n, children }) {
  return <p className="label"><b>{n}</b>{children}</p>
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
              <a key={n.id} href={n.href || `#${n.id}`} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>{n.label}</a>
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
              <p className="label"><span className="logo-dot" />Consumo del hogar en tiempo real</p>
              <h1>Deja de esperar el recibo <span>para saber cuánto gastas.</span></h1>
              <p className="lead">
                Cada electrodoméstico te muestra cuánta energía usa, ahora mismo y en pesos.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="./demo.html">Ver una casa en vivo</a>
                <a className="btn btn-line" href="./simulador/">Calcular mi consumo</a>
              </div>
            </div>
            <HeroPulse />
          </div>
        </section>

        <section id="problema">
          <div className="wrap">
            <div className="sec-head">
              <Label n="01">El problema</Label>
              <h2>El recibo llega tarde.</h2>
            </div>
            <Problem />
          </div>
        </section>

        <section id="como-funciona">
          <div className="wrap">
            <div className="sec-head">
              <Label n="02">Cómo funciona</Label>
              <h2>Mide. Convierte. Te avisa.</h2>
            </div>
            <How />
          </div>
        </section>

        <section id="mas">
          <div className="wrap">
            <details className="more">
              <summary>Más información: mercado, comparación, hoja de ruta y preguntas</summary>
              <div className="more-body">
                <Numbers />
                <Compare />
                <Roadmap />
                <div>
                  {faq.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>

        <section id="lista" className="final">
          <div className="wrap">
            <h2>Conoce tu consumo antes de que llegue el recibo.</h2>
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
