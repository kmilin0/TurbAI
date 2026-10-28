import { useEffect, useRef } from 'react'

const BASE_H = 840
const MIN_W = 1100

export default function FitPage({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const root = document.documentElement
    if (!el) return

    const apply = () => {
      const { innerWidth: w, innerHeight: h } = window
      if (w < 900) {
        el.style.zoom = ''
        el.style.height = ''
        el.classList.remove('is-fit')
        root.classList.remove('fit-on')
        return
      }

      const scale = Math.min(1.8, Math.max(0.8, Math.min(h / BASE_H, w / MIN_W)))
      el.style.zoom = `${scale}`
      el.style.height = `${h / scale}px`
      el.classList.add('is-fit')
      root.classList.add('fit-on')
    }

    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      el.style.zoom = ''
      el.style.height = ''
      el.classList.remove('is-fit')
      root.classList.remove('fit-on')
    }
  }, [])

  return <div className="fit" ref={ref}>{children}</div>
}
