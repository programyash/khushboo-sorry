import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { isFinePointer, prefersReducedMotion } from '../lib/utils'

/** 3D hover tilt with a springy return. Desktop / fine pointers only. */
export function useTilt(ref: RefObject<HTMLElement | null>, enabled = true, max = 9, lift = 1.03) {
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || !isFinePointer() || prefersReducedMotion()) return
    gsap.set(el, { transformPerspective: 900 })
    const make = () => [
      gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' }),
      gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' }),
      gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' }),
    ]
    let [rx, ry, sc] = make()
    let back: gsap.core.Tween | null = null
    const move = (e: PointerEvent) => {
      if (back) {
        back.kill()
        back = null
        ;[rx, ry, sc] = make()
      }
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max * 2)
      rx(-py * max * 2)
      sc(lift)
    }
    const leave = () => {
      back = gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.45)', overwrite: true })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, enabled, max, lift])
}
