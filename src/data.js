export const nav = [
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'escaneo', label: 'Escaneo' },
  { id: 'demo', label: 'Demo' },
  { id: 'niveles', label: 'Niveles' },
  { id: 'hoja-de-ruta', label: 'Hoja de ruta' },
  { id: 'preguntas', label: 'Preguntas' },
]

// Cada pregunta trae la respuesta de ejemplo que TurbAI daría
export const questions = [
  {
    q: '¿Por qué llegó tan cara la factura este mes?',
    a: 'El aire de la habitación consumió 34% más de lo normal. Explica $41.000 de los $52.000 COP de diferencia con el mes pasado.',
  },
  {
    q: '¿Por qué la nevera está consumiendo más de lo normal?',
    a: 'El motor arranca el doble de veces que hace un mes. Suele pasar cuando el empaque de la puerta ya no sella bien.',
  },
  {
    q: '¿Por qué se dañó justo ahora, sin ningún aviso?',
    a: 'Sí hubo aviso: la bomba llevaba 9 días encendiéndose de madrugada, señal de una fuga. Nadie lo estaba mirando.',
  },
]

export const steps = [
  {
    title: 'Mide y escucha',
    text: 'Sensores de energía, agua y temperatura, o solo el micrófono de tu celular, registran cómo se comporta tu casa.',
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

// Niveles de producto: se empieza gratis, solo con el celular
export const tiers = [
  {
    tag: 'Nivel 0', name: 'Gratis', price: 'Solo tu celular', free: true,
    items: ['Escaneo por sonido de tus equipos', 'Tu factura explicada en palabras simples', 'Comparación con hogares similares de tu estrato'],
  },
  {
    tag: 'Nivel 1', name: 'Kit TurbAI', price: 'Sensor + suscripción',
    items: ['Monitoreo continuo de energía y agua', 'Alertas cuando un equipo se sale de su patrón', 'Modo ahorro para temporadas de racionamiento'],
  },
  {
    tag: 'Nivel 2', name: 'Care', price: 'Pago por servicio',
    items: ['Un técnico de la red cuando una alerta lo necesita', 'Reparación verificada con datos', 'Si el consumo no vuelve a lo normal, el técnico regresa sin costo'],
  },
]

export const audiences = [
  {
    name: 'Hogares',
    text: 'Entienden su factura, evitan daños y saben a quién llamar antes de la emergencia.',
    points: ['Empiezan gratis con el celular', 'Pagan solo cuando necesitan más', 'Técnicos con trabajo verificado'],
  },
  {
    name: 'Conjuntos residenciales',
    text: 'El administrador vigila bombas, motobombas, ascensores y zonas comunes: equipos que fallan sin aviso y cuya cuenta pagan todos.',
    points: ['Un contrato cubre muchas unidades', 'Mantenimiento antes de la emergencia', 'Plan opcional para cada residente'],
  },
  {
    name: 'Aliados',
    text: 'Aseguradoras de hogar y empresas de servicios públicos ganan con una casa que previene.',
    points: ['Menos siniestros por fugas y daños eléctricos', 'Gestión de la demanda en horas pico', 'Hogares preparados para racionamientos'],
  },
]

export const numbers = [
  { value: '30–40%', text: 'del consumo energético mundial ocurre en edificios residenciales.', source: 'IEA' },
  { value: '5–15%', text: 'de ahorro es posible con medición inteligente, tarifas y controles digitales.', source: 'IEA, Energy Savings' },
  { value: '57.7%', text: 'de la población mundial vive en zonas urbanas.', source: 'Banco Mundial, 2024' },
  { value: '$517 → $1.706 billones', text: 'de pesos (COP): mercado global de hogares inteligentes, 2025 a 2030.', source: 'Grand View Research · USD convertidos a TRM $3.175' },
  { value: '21.1B', text: 'dispositivos IoT conectados en el mundo a fines de 2025.', source: 'IoT Analytics' },
]

// Comparación general por categoría, según la información pública de cada producto
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

export const revenue = [
  { title: 'Suscripción mensual', text: 'Monitoreo continuo y alertas del nivel 1.' },
  { title: 'Venta e instalación del kit', text: 'Sensor de bajo costo para energía, agua y temperatura.' },
  { title: 'Comisión por servicio verificado', text: 'Un porcentaje de cada reparación que TurbAI conecta y comprueba con datos.' },
  { title: 'Planes para conjuntos residenciales', text: 'Monitoreo de bombas, ascensores y zonas comunes para la administración.' },
  { title: 'Alianzas', text: 'Con aseguradoras de hogar y empresas de servicios públicos.' },
]

export const jobs = {
  tech: ['Desarrollo de software', 'Ingeniería IoT', 'Inteligencia artificial', 'Análisis de datos', 'Diseño UX/UI', 'Soporte y ventas'],
  field: ['Electricistas', 'Plomeros', 'Técnicos de refrigeración y aire', 'Técnicos de electrodomésticos', 'Instaladores de sensores', 'Mantenimiento general'],
}

export const phases = [
  { tag: 'MVP', name: 'Monitor', text: 'Consumo de energía y agua en un panel simple, y escaneo por sonido desde el celular.', detail: 'Es el primer paso: medir y escuchar bien antes de predecir.' },
  { tag: 'Fase 2', name: 'Insight', text: 'Tu factura y tus patrones, explicados.', detail: 'Lectura de la factura con IA y comparación con hogares similares de tu estrato y ciudad.' },
  { tag: 'Fase 3', name: 'Predict', text: 'Anomalías y mantenimiento predictivo.', detail: 'Modelos de consumo y de sonido que aprenden el patrón de cada equipo y anticipan la falla.' },
  { tag: 'Fase 4', name: 'Care', text: 'Técnicos de la red con reparación verificada.', detail: 'Si después del arreglo el consumo no vuelve a lo normal, el técnico regresa sin costo.' },
  { tag: 'Fase 5', name: 'Smart Home', text: 'Automatización de dispositivos.', detail: 'Acciones automáticas, como cerrar el agua ante una fuga o activar el modo ahorro en un racionamiento.' },
]

export const mvp = [
  'Escaneo por sonido desde el celular (ya funciona en esta página)',
  'Sensor de bajo costo: energía, agua y temperatura',
  'Panel de consumo y alertas por umbral',
  'Detección de anomalías por comparación con el historial',
  'Recomendaciones en lenguaje simple',
]

export const faq = [
  {
    q: '¿En qué se diferencia de Sense, Emporia o Ting?',
    a: 'Esos productos miden muy bien, pero se compran en el exterior, están pensados para Estados Unidos y se quedan en la alerta. TurbAI empieza gratis con el celular, une energía, agua y sonido, te conecta con un técnico local y verifica con datos que la reparación funcionó.',
  },
  {
    q: '¿El escaneo por sonido graba lo que digo?',
    a: 'No. El audio se analiza dentro de tu navegador y solo se calcula la huella de frecuencias del equipo. No se guarda ni se envía ninguna grabación.',
  },
  {
    q: '¿Usa inteligencia artificial de verdad?',
    a: 'El MVP usa detección estadística: compara cada equipo contra su propio historial de consumo y contra su huella de sonido. Es simple, explicable y funciona con pocos datos. En la fase Predict se suman modelos de aprendizaje automático entrenados con los datos de los hogares.',
  },
  {
    q: '¿Qué es una reparación verificada?',
    a: 'Después de que el técnico termina, TurbAI sigue midiendo el equipo. Si el consumo vuelve a su patrón, la reparación queda verificada y el técnico gana reputación. Si no, el técnico regresa sin costo.',
  },
  {
    q: '¿TurbAI reemplaza al técnico?',
    a: 'No. La IA detecta y recomienda; siempre es una persona quien hace la revisión o la reparación. TurbAI hace que el técnico llegue antes de la emergencia.',
  },
  {
    q: '¿Ya puedo usarlo?',
    a: 'El escaneo por sonido ya funciona en esta página. El resto es un proyecto de emprendimiento en Ingeniería de Software: el primer paso es el MVP, TurbAI Monitor, y las fases siguientes son visión de producto.',
  },
  {
    q: '¿De dónde salen las cifras de esta página?',
    a: 'De fuentes públicas: IEA, Banco Mundial, Grand View Research e IoT Analytics. Son estimaciones de la industria, no resultados propios de TurbAI. Las cifras en dólares se convirtieron a pesos colombianos con una TRM de referencia de $3.175 (octubre de 2026). Los enlaces están al final de la página.',
  },
]

export const sources = [
  { name: 'Grand View Research — Smart Homes Market', url: 'https://www.grandviewresearch.com/industry-analysis/smart-homes-industry' },
  { name: 'IoT Analytics — Connected IoT devices', url: 'https://iot-analytics.com/number-connected-iot-devices' },
  { name: 'IEA — Energy Savings', url: 'https://www.iea.org/reports/energy-savings' },
  { name: 'Banco Mundial — Población urbana', url: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS' },
]
