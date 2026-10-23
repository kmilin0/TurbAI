// Ejemplos del escaneo por sonido para presentar sin micrófono (p. ej. en lugares con ruido).
// Son perfiles de sonido simulados, no grabaciones reales: base() es el equipo sano y
// fault() el sonido que aparece con la falla. f es la frecuencia en Hz.
const g = (f, mu, s) => Math.exp(-((f - mu) ** 2) / (2 * s * s))

export const examples = [
  {
    id: 'ventilador',
    device: 'Ventilador',
    title: 'Roce en las aspas',
    base: (f) => 1.2 * g(f, 120, 25) + 0.8 * g(f, 240, 40) + 0.35 * g(f, 900, 300) + 0.05 * Math.exp(-f / 3000),
    fault: (f) => 0.6 * g(f, 4000, 1800) + 0.4 * g(f, 2200, 700),
    cause: 'Algo roza las aspas o la rejilla.',
    advice: 'Apágalo, revisa la rejilla y que las aspas no estén torcidas.',
  },
  {
    id: 'nevera',
    device: 'Nevera',
    title: 'Compresor forzado',
    base: (f) => 1.0 * g(f, 120, 18) + 0.55 * g(f, 240, 30) + 0.25 * g(f, 360, 40) + 0.3 * g(f, 700, 220) + 0.04 * Math.exp(-f / 2500),
    fault: (f) => 1.5 * g(f, 80, 15) + 1.1 * g(f, 480, 50) + 0.8 * g(f, 600, 60),
    cause: 'El compresor trabaja con más esfuerzo, típico de un empaque que no sella o un condensador sucio.',
    advice: 'Revisa el empaque de la puerta y limpia el condensador.',
    tech: 'Técnico de electrodomésticos',
  },
  {
    id: 'aire',
    device: 'Aire acondicionado',
    title: 'Filtro sucio',
    base: (f) => 0.5 * g(f, 150, 40) + 0.8 * g(f, 400, 150) + 0.7 * g(f, 1000, 400) + 0.06 * Math.exp(-f / 3000),
    fault: (f) => 1.7 * g(f, 1800, 300),
    cause: 'El aire pasa con más dificultad y aparece un silbido leve.',
    advice: 'Limpia el filtro. Si el sonido sigue igual, agenda un mantenimiento.',
    tech: 'Técnico de refrigeración y aire',
  },
  {
    id: 'lavadora',
    device: 'Lavadora',
    title: 'Rodamiento gastado',
    base: (f) => 0.6 * g(f, 80, 20) + 0.8 * g(f, 200, 50) + 0.3 * g(f, 600, 200) + 0.04 * Math.exp(-f / 2500),
    fault: (f) => 1.1 * g(f, 4500, 1500) + 0.8 * g(f, 100, 25),
    cause: 'Aparece un chirrido agudo y más vibración al girar el tambor.',
    advice: 'Evita cargas pesadas hasta que la revisen.',
    tech: 'Técnico de electrodomésticos',
  },
  {
    id: 'bomba',
    device: 'Bomba de agua',
    title: 'Funcionando bien',
    base: (f) => 1.0 * g(f, 120, 20) + 0.5 * g(f, 240, 35) + 0.3 * g(f, 1500, 800) + 0.04 * Math.exp(-f / 3000),
    fault: () => 0,
    cause: 'Su sonido coincide con su huella sana.',
    advice: 'No hace falta hacer nada. TurbAI la vuelve a escuchar la próxima semana.',
  },
]
