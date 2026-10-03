import { useEffect, useRef, useState } from 'react'

/** IntersectionObserver hook. With `once`, it stays true after first entering. */
export function useInView<T extends Element = HTMLDivElement>(opts: { once?: boolean; rootMargin?: string; threshold?: number } = {}) {
  const { once = true, rootMargin = '0px 0px -15% 0px', threshold = 0.15 } = opts
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, rootMargin, threshold])
  return [ref, inView] as const
}
