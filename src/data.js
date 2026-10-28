export const nav = [
  { id: 'problema', label: 'El problema' },
  { id: 'demo', label: 'Demo', href: './demo.html' },
  { id: 'simulador', label: 'Simulador', href: './simulador/' },
]

export const steps = [
  { title: 'Mide', text: 'Cada electrodoméstico conectado envía su consumo.' },
  { title: 'Convierte', text: 'Lo ves en vatios y en pesos colombianos.' },
  { title: 'Te avisa', text: 'Si un equipo gasta de más, lo sabes ese día, no cuando llega el recibo.' },
]

export const questions = [
  {
    q: '¿Cuánto me está costando usar el aire acondicionado?',
    a: 'El simulador estima el costo mensual con la potencia del equipo, las horas de uso y la tarifa por kWh. Ajusta las horas para ver cómo cambia el gasto.',
  },
  {
    q: '¿Qué electrodoméstico consume más en mi casa?',
    a: 'El consumo depende de la potencia y del tiempo de uso. En el simulador puedes comparar el costo estimado de cada equipo y cambiar sus horas de uso.',
  },
  {
    q: '¿Tengo que esperar la factura para conocer mi consumo?',
    a: 'No. Una estimación basada en tus electrodomésticos, sus horas de uso y una tarifa de referencia te ayuda a entender el gasto antes de que llegue el recibo.',
  },
]

export const numbers = [
  { value: '30–40%', text: 'del consumo energético mundial ocurre en edificios residenciales.', source: 'IEA' },
  { value: '5–15%', text: 'de ahorro es posible con medición inteligente, tarifas y controles digitales.', source: 'IEA, Energy Savings' },
  { value: '57.7%', text: 'de la población mundial vive en zonas urbanas.', source: 'Banco Mundial, 2024' },
  { value: '$517 → $1.706 billones', text: 'de pesos (COP): mercado global de hogares inteligentes, 2025 a 2030.', source: 'Grand View Research · USD convertidos a TRM $3.175' },
  { value: '21.1B', text: 'dispositivos IoT conectados en el mundo a fines de 2025.', source: 'IoT Analytics' },
]

export const compare = {
  cols: ['Energía', 'Agua', 'Sonido', 'Explica', 'Técnico', 'Verifica', 'Colombia'],
  defs: [
    'mide el consumo eléctrico de la casa o de cada equipo.',
    'mide el agua o detecta fugas.',
    'diagnostica los equipos por su sonido, solo con el celular.',
    'traduce los datos a recomendaciones en palabras simples.',
    'te conecta con alguien que lo arregla.',
    'comprueba con datos que la reparación funcionó.',
    'está pensado para los hogares, tarifas y precios de Colombia.',
  ],
  rows: [
    { name: 'Medidor y app de la empresa de energía', has: [1, 0, 0, 0, 0, 0, 1] },
    { name: 'Monitores de energía', note: 'Sense, Emporia', has: [1, 0, 0, 1, 0, 0, 0] },
    { name: 'Detectores de fugas', note: 'Flo by Moen, Phyn', has: [0, 1, 0, 1, 0, 0, 0] },
    { name: 'Seguridad eléctrica', note: 'Ting', has: [0, 0, 0, 1, 1, 0, 0] },
    { name: 'Servicio técnico tradicional', has: [0, 0, 0, 0, 1, 0, 1] },
    { name: 'TurbAI Home', has: [1, 1, 1, 1, 1, 1, 1], highlight: true },
  ],
}

export const phases = [
  { tag: 'MVP', name: 'Monitor', text: 'Consumo de energía y agua en un panel simple.', detail: 'Es el primer paso: entender cuánto consume cada equipo y cuánto cuesta.' },
  { tag: 'Fase 2', name: 'Insight', text: 'Tu factura y tus patrones, explicados.', detail: 'Lectura de la factura y comparación con hogares similares.' },
  { tag: 'Fase 3', name: 'Predict', text: 'Anomalías y mantenimiento predictivo.', detail: 'Modelos que aprenden el patrón de cada equipo y anticipan cambios.' },
  { tag: 'Fase 4', name: 'Care', text: 'Técnicos de la red con reparación verificada.', detail: 'Seguimiento del consumo después del arreglo para comprobar el resultado.' },
  { tag: 'Fase 5', name: 'Smart Home', text: 'Automatización de dispositivos.', detail: 'Acciones automáticas para ahorrar energía y agua.' },
]

export const mvp = [
  'Estimación del consumo mensual de los electrodomésticos',
  'Conversión del consumo a un costo aproximado en pesos',
  'Ajuste de horas de uso y tarifa por kWh',
  'Comparación de equipos y meta mensual',
]

export const faq = [
  {
    q: '¿El simulador calcula mi factura exacta?',
    a: 'No. Es una estimación con potencias promedio y una tarifa de ejemplo. Tu factura puede variar según el equipo, su estado, el uso real, la ciudad y el operador.',
  },
  {
    q: '¿Cómo se estima el costo mensual?',
    a: 'Se calcula el consumo aproximado de cada equipo a partir de su potencia y horas de uso, se proyecta a 30 días y se multiplica por la tarifa por kWh.',
  },
  {
    q: '¿Puedo cambiar la tarifa y mis horas de uso?',
    a: 'Sí. Usa los controles del simulador para ajustar las horas diarias de cada electrodoméstico, la tarifa por kWh y tu meta mensual.',
  },
  {
    q: '¿De dónde salen las cifras de mercado?',
    a: 'Son estimaciones de fuentes públicas citadas al final de la página; no son resultados propios de TurbAI.',
  },
]

export const sources = [
  { name: 'Grand View Research — Smart Homes Market', url: 'https://www.grandviewresearch.com/industry-analysis/smart-homes-industry' },
  { name: 'IoT Analytics — Connected IoT devices', url: 'https://iot-analytics.com/number-connected-iot-devices' },
  { name: 'IEA — Energy Savings', url: 'https://www.iea.org/reports/energy-savings' },
  { name: 'Banco Mundial — Población urbana', url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS' },
]