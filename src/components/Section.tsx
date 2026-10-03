import { useEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react'
import { CHAPTERS, type ChapterId } from '../data/chapters'
import { cn } from '../lib/utils'

interface SectionProps {
  id: ChapterId
  className?: string
  style?: CSSProperties
  children: ReactNode
  sectionRef?: Ref<HTMLElement>
  label?: string
}

/**
 * Every chapter of the story is a Section. It exposes `data-active`, which the
 * CSS uses to pause decorative loops while the section is off-screen.
 */
export function Section({ id, className, style, children, sectionRef, label }: SectionProps) {
  const local = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = local.current
    if (!el) return
    el.dataset.active = 'false'
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.active = entry.isIntersecting ? 'true' : 'false'
      },
      { rootMargin: '15% 0px 15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={(node) => {
        local.current = node
        if (typeof sectionRef === 'function') sectionRef(node)
        else if (sectionRef) (sectionRef as { current: HTMLElement | null }).current = node
      }}
      id={id}
      data-chapter={id}
      aria-label={label ?? CHAPTERS[id]}
      className={cn('relative', className)}
      style={style}
    >
      {children}
    </section>
  )
}
