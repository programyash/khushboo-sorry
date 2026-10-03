import { useEffect, useRef, type ButtonHTMLAttributes, type Ref } from 'react'
import { gsap } from '../lib/gsap'
import { cn, isFinePointer, prefersReducedMotion } from '../lib/utils'

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number
  wrapClassName?: string
  ref?: Ref<HTMLButtonElement>
}

/**
 * A button that leans toward the cursor and springs back when it leaves.
 * The magnetic transform lives on a wrapper so the button's own :active
 * squish still works.
 */
export function MagneticButton({ strength = 0.32, wrapClassName, className, children, ref, ...rest }: MagneticButtonProps) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    const make = () => [
      gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
      gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
    ]
    let [xTo, yTo] = make()
    let back: gsap.core.Tween | null = null
    const move = (e: PointerEvent) => {
      // the springy return tween replaced our quickTo tweens; rebuild them
      if (back) {
        back.kill()
        back = null
        ;[xTo, yTo] = make()
      }
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      back = gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <span ref={wrap} className={cn('inline-block will-change-transform', wrapClassName)}>
      <button ref={ref} data-cursor="hover" className={className} {...rest}>
        {children}
      </button>
    </span>
  )
}
