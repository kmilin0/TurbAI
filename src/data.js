export const nav = [
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'demo', label: 'Demo en vivo' },
  { id: 'ejemplo', label: 'Un ejemplo' },
  { id: 'tecnicos', label: 'Técnicos' },
  { id: 'hoja-de-ruta', label: 'Hoja de ruta' },
  { id: 'preguntas', label: 'Preguntas' },
]

export const questions = [
  '¿Por qué llegó tan cara la factura este mes?',
  '¿Por qué la nevera está consumiendo más de lo normal?',
  '¿Por qué se dañó justo ahora, sin ningún aviso?',
]

export const steps = [
  {
    title: 'Mide',
    text: 'Sensores básicos de energía, agua y temperatura registran cómo se comporta tu casa, día a día.',
  },
  {
    title: 'Aprende lo normal',
    text: 'TurbAI compara cada equipo contra su propio historial. No contra un promedio genérico: contra tu casa.',
  },
  {
    title: 'Te avisa y te conecta',
    text: 'Si algo se sale del patrón, recibes una alerta en palabras simples y, si hace falta, un técnico de la red.',
  },
]

export const stats = [
  { value: '30–40%', text: 'del consumo energético mundial ocurre en edificios residenciales.', source: 'IEA' },
  { value: '5–15%', text: 'de ahorro es posible con medición inteligente, tarifas y controles digitales.', source: 'IEA, Energy Savings' },
  { value: '57.7%', text: 'de la población mundial vive en zonas urbanas.', source: 'Banco Mundial, 2024' },
]

export const compare = {
  cols: ['Muestra', 'Explica', 'Detecta', 'Predice', 'Conecta'],
  rows: [
    { name: 'Medidor convencional', has: [1, 0, 0, 0, 0] },
    { name: 'App de domótica', has: [1, 0, 0, 0, 0] },
    { name: 'Asistente de voz', has: [0, 0, 0, 0, 0] },
    { name: 'Servicio técnico tradicional', has: [0, 0, 0, 0, 1] },
    { name: 'TurbAI Home', has: [1, 1, 1, 1, 1], highlight: true },
  ],
}

export const revenue = [
  { title: 'Suscripción mensual', text: 'Acceso a la plataforma, el panel de consumo y las alertas.' },
  { title: 'Venta e instalación de sensores', text: 'Dispositivos básicos para conectar el hogar.' },
  { title: 'Servicios de mantenimiento', text: 'Ejecutados por la red de técnicos aliados.' },
  { title: 'Comisión por conexión', text: 'Un porcentaje cada vez que TurbAI conecta a un usuario con un técnico.' },
  { title: 'Planes premium', text: 'Análisis avanzado y mantenimiento predictivo.' },
]

export const jobs = {
  tech: ['Desarrollo de software', 'Ingeniería IoT', 'Inteligencia artificial', 'Análisis de datos', 'Diseño UX/UI', 'Soporte y ventas'],
  field: ['Electricistas', 'Plomeros', 'Técnicos de refrigeración y aire', 'Técnicos de electrodomésticos', 'Instaladores de sensores', 'Mantenimiento general'],
}

export const market = [
  { value: '$162.8B → $537.3B', text: 'mercado global de hogares inteligentes, 2025 a 2030.', source: 'Grand View Research' },
  { value: '21.1B', text: 'dispositivos IoT conectados en el mundo a fines de 2025.', source: 'IoT Analytics' },
]

export const phases = [
  { tag: 'MVP', name: 'Monitor', text: 'Consumo de energía y agua en un panel simple.' },
  { tag: 'Fase 2', name: 'Insight', text: 'Explicación de los patrones de consumo.' },
  { tag: 'Fase 3', name: 'Predict', text: 'Anomalías y mantenimiento predictivo.' },
  { tag: 'Fase 4', name: 'Care', text: 'Conexión directa con técnicos.' },
  { tag: 'Fase 5', name: 'Smart Home', text: 'Automatización de dispositivos.' },
]

export const mvp = [
  'App web o móvil con panel de consumo',
  'Sensores básicos: energía, agua y temperatura',
  'Alertas por umbral de consumo',
  'Detección de anomalías por comparación histórica',
  'Recomendaciones en lenguaje simple',
]

export const faq = [
  {
    q: '¿TurbAI es un chatbot?',
    a: 'No. TurbAI no es un chatbot ni una empresa de bots. Es una plataforma que combina sensores, datos e inteligencia artificial para entender el consumo del hogar y anticipar fallas.',
  },
  {
    q: '¿Qué tengo que instalar en mi casa?',
    a: 'En el MVP, sensores básicos de energía, agua y temperatura. Los datos llegan a la app, donde ves el consumo y recibes las alertas.',
  },
  {
    q: '¿TurbAI reemplaza al técnico?',
    a: 'No. La IA detecta y recomienda; siempre es una persona quien hace la revisión o la reparación. TurbAI hace que el técnico llegue antes de la emergencia.',
  },
  {
    q: '¿Ya puedo usarlo?',
    a: 'Todavía no. TurbAI Home es un proyecto de emprendimiento en Ingeniería de Software. El primer paso es el MVP, TurbAI Monitor; las fases siguientes son visión de producto.',
  },
  {
    q: '¿De dónde salen las cifras de esta página?',
    a: 'De fuentes públicas: IEA, Banco Mundial, Grand View Research e IoT Analytics. Son estimaciones de la industria, no resultados propios de TurbAI. Los enlaces están al final de la página.',
  },
]

export const sources = [
  { name: 'Grand View Research — Smart Homes Market', url: 'https://www.grandviewresearch.com/industry-analysis/smart-homes-industry' },
  { name: 'IoT Analytics — Number of connected IoT devices', url: 'https://iot-analytics.com/number-connected-iot-devices' },
  { name: 'IEA — Energy Savings', url: 'https://www.iea.org/reports/energy-savings' },
  { name: 'Grand View Research — Predictive Maintenance Market', url: 'https://www.grandviewresearch.com/industry-analysis/predictive-maintenance-market' },
  { name: 'Banco Mundial — Población urbana (% del total)', url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS' },
]
