import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './components/Dashboard.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import './styles.css'

// Página independiente: solo la demo, sin la navegación de la landing
function DemoPage() {
  return (
    <>
      <header className="nav solid">
        <div className="wrap nav-in demo-bar">
          <a href="./" className="brand"><i aria-hidden="true" />TurbAI</a>
          <div className="nav-tools">
            <a href="./" className="btn btn-line btn-sm">← Volver al inicio</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="demo-page">
        <div className="wrap">
          <div className="sec-head demo-head">
            <div>
              <p className="label"><b>●</b>Demo en vivo</p>
              <h1 className="demo-title">Tú controlas la casa. <span>TurbAI la vigila.</span></h1>
            </div>
            <ol>
              <li>Enciende o apaga equipos y mira cómo cambia el consumo.</li>
              <li>Provoca una falla: un filtro sucio, una fuga, una nevera mal cerrada.</li>
              <li>Pide el técnico y mira cómo TurbAI verifica con datos que la reparación funcionó.</li>
            </ol>
          </div>
          <Dashboard />
        </div>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>
)
