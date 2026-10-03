import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer } from '../hooks/useMedia'

/**
 * Custom cursor (fine pointers only):
 *  - default: a soft dot + trailing ring
 *  - hover:   the ring expands over interactive things
 *  - photo:   the ring becomes a "view memory" badge
 *  - heart:   a little heart, for the special buttons
 * Elements opt in with data-cursor / data-cursor-label.
 */
export function Cursor() {
  const fine = useFinePointer()
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!fine || !root.current || !dot.current || !ring.current) return
    const html = document.documentElement
    html.classList.add('has-cursor')
    const r = root.current
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3.out' })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3.out' })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.42, ease: 'power3.out' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.42, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      r.dataset.visible = 'true'
      xd(e.clientX)
      yd(e.clientY)
      xr(e.clientX)
      yr(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button, [role="button"], input, label, select, textarea')
      const state = t?.getAttribute('data-cursor') ?? (t ? 'hover' : 'default')
      r.dataset.state = state
      if (label.current) label.current.textContent = t?.getAttribute('data-cursor-label') ?? ''
    }
    const leave = () => (r.dataset.visible = 'false')
    const down = () => (r.dataset.down = 'true')
    const up = () => (r.dataset.down = 'false')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    html.addEventListener('mouseleave', leave)
    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      html.removeEventListener('mouseleave', leave)
    }
  }, [fine])

  if (!fine) return null

  return (
    <div ref={root} aria-hidden data-state="default" data-visible="false" className="cursor-root pointer-events-none fixed inset-0 z-[300]">
      <div ref={ring} className="absolute top-0 left-0">
        <div className="cursor-ring">
          <span ref={label} className="cursor-label" />
          <svg viewBox="0 0 48 44" className="cursor-heart">
            <path d="M24 41 C 8 29, 1 19, 5 10 C 9 1, 20 1, 24 10 C 28 1, 39 1, 43 10 C 47 19, 40 29, 24 41 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div ref={dot} className="absolute top-0 left-0">
        <div className="cursor-dot" />
      </div>
      <style>{`
        .cursor-root { opacity: 0; transition: opacity .3s; }
        .cursor-root[data-visible="true"] { opacity: 1; }
        .cursor-ring {
          width: 80px; height: 80px; border-radius: 999px;
          display: grid; place-items: center;
          border: 1.5px solid rgba(242,103,143,.7);
          background: rgba(255,143,176,0);
          transform: translate(-50%,-50%) scale(.42);
          transition: transform .45s cubic-bezier(.22,1,.36,1), background-color .3s, border-color .3s;
        }
        .cursor-dot {
          width: 7px; height: 7px; border-radius: 999px; background: #f2678f;
          transform: translate(-50%,-50%);
          transition: transform .3s cubic-bezier(.22,1,.36,1), opacity .2s;
        }
        .cursor-label {
          font: 700 11px/1 var(--font-sans); letter-spacing: .08em; text-transform: uppercase;
          color: #fff; opacity: 0; transition: opacity .25s; white-space: nowrap; position: absolute;
        }
        .cursor-heart { width: 26px; color: #f2678f; opacity: 0; transition: opacity .25s, transform .4s cubic-bezier(.34,1.56,.64,1); transform: scale(.4); position: absolute; }
        [data-state="hover"] .cursor-ring { transform: translate(-50%,-50%) scale(.75); background: rgba(255,143,176,.16); border-color: rgba(242,103,143,.45); }
        [data-state="photo"] .cursor-ring { transform: translate(-50%,-50%) scale(1.15); background: rgba(43,29,47,.82); border-color: transparent; }
        [data-state="photo"] .cursor-label { opacity: 1; }
        [data-state="photo"] .cursor-dot, [data-state="heart"] .cursor-dot { opacity: 0; }
        [data-state="heart"] .cursor-ring { transform: translate(-50%,-50%) scale(.8); background: #fff; border-color: rgba(242,103,143,.4); }
        [data-state="heart"] .cursor-heart { opacity: 1; transform: scale(1); }
        [data-state="hidden"] .cursor-ring, [data-state="hidden"] .cursor-dot { opacity: 0; }
        [data-down="true"] .cursor-ring { transform: translate(-50%,-50%) scale(.36); }
      `}</style>
    </div>
  )
}
