// Maqueta de la app del MVP. Los valores son de ejemplo, no mediciones reales.
const devices = [
  { name: 'Aire acondicionado', room: 'Habitación', kwh: '4.1', delta: '+34%', warn: true },
  { name: 'Nevera', room: 'Cocina', kwh: '1.2', delta: '−2%' },
  { name: 'Bomba de agua', room: 'Patio', kwh: '0.8', delta: '+1%' },
  { name: 'Lavadora', room: 'Zona de ropas', kwh: '0.6', delta: '0%' },
]

const bars = [42, 38, 45, 40, 44, 39, 58]

export default function Phone() {
  return (
    <div className="phone" aria-label="Maqueta de la app TurbAI Home">
      <div className="phone-screen">
        <div className="app-bar">
          <span>Hoy</span>
          <span className="app-home">Apto 502</span>
        </div>

        <div className="app-total">
          <span className="app-label">Consumo de esta semana</span>
          <strong>41.3 kWh</strong>
          <span className="app-sub">8% más que tu semana habitual</span>
        </div>

        <div className="app-bars" aria-hidden="true">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}px` }} className={i === bars.length - 1 ? 'hot' : ''} />
          ))}
        </div>
        <div className="app-days" aria-hidden="true">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i}>{d}</span>)}
        </div>

        <ul className="app-list">
          {devices.map((d) => (
            <li key={d.name} className={d.warn ? 'warn' : ''}>
              <div>
                <b>{d.name}</b>
                <small>{d.room}</small>
              </div>
              <div className="app-right">
                <b>{d.kwh} kWh</b>
                <small>{d.delta}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
