import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FitPage from './components/FitPage.jsx'
import SimuladorConsumo from './components/SimuladorConsumo.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import './styles.css'

function SimulatorPage() {
  return (
    <FitPage>
      <header className="nav solid">
        <div className="wrap nav-in demo-bar">
          <a href="../" className="brand"><i aria-hidden="true" />TurbAI <span>Simulador</span></a>
          <div className="nav-tools">
            <a href="../" className="btn btn-line btn-sm">← Volver al inicio</a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="simulator-page">
        <div className="wrap">
          <div className="sec-head simulator-head">
            <h1 className="simulator-title">¿Cuánto gasta <span>tu casa?</span></h1>
            <p>Elige tus electrodomésticos y ajusta las horas de uso para estimar el costo mensual.</p>
          </div>
          <SimuladorConsumo />
        </div>
      </main>
    </FitPage>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SimulatorPage />
  </StrictMode>
)
