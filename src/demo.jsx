import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './components/Dashboard.jsx'
import FitPage from './components/FitPage.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import './styles.css'

function DemoPage() {
  return (
    <FitPage>
      <header className="nav solid">
        <div className="wrap nav-in demo-bar">
          <a href="./" className="brand"><i aria-hidden="true" />TurbAI <span>Demo en vivo</span></a>
          <div className="nav-tools">
            <a href="./" className="btn btn-line btn-sm">← Volver al inicio</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="demo-page">
        <div className="wrap">
          <div className="sec-head demo-head">
            <h1 className="demo-title">Tu casa, <span>en tiempo real.</span></h1>
            <p className="demo-instructions">Controla los equipos o provoca una falla para ver cómo responde TurbAI.</p>
          </div>
          <Dashboard />
        </div>
      </main>
    </FitPage>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>
)
