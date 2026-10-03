import { useRef } from 'react'
import { Doodle } from '../components/Doodle'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photo } from '../data/photos'
import { ERAS, YEARS, type Era, type YearCard } from '../data/timeline'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { MiniScene } from '../scenes/MiniScenes'
import { cn } from '../lib/utils'

/**
 * Ten years, horizontally. On large screens the section pins and vertical
 * scroll (or a mouse drag) moves through the years; each era tints the room.
 * On phones it becomes a vertical diary with the same cards.
 */
export function Timeline() {
  const { reduced, unlock, lenis } = useExperience()
  const root = useRef<HTMLElement>(null)
  // Read through a ref so the pin is never rebuilt (and re-ordered) when Lenis boots.
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add({ desktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean }
        const track = q('.tl-track')[0] as HTMLElement
        const viewport = q('.tl-viewport')[0] as HTMLElement

        if (desktop) {
          const distance = () => track.scrollWidth - window.innerWidth
          const h = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: viewport,
              pin: true,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: reduce ? true : 0.7,
              invalidateOnRefresh: true,
              onUpdate: (self) => gsap.set(q('.tl-progress-fill'), { scaleX: self.progress }),
            },
          })

          // Era tints + per-card reveals ride on the horizontal tween.
          q('.tl-era').forEach((panel) => {
            const tint = (panel as HTMLElement).dataset.tint!
            ScrollTrigger.create({
              trigger: panel,
              containerAnimation: h,
              start: 'left 60%',
              end: 'right 40%',
              onToggle: (self) => self.isActive && gsap.to(viewport, { backgroundColor: tint, duration: 0.8, overwrite: 'auto' }),
            })
          })
          if (!reduce) {
            q('.tl-card').forEach((card, i) => {
              gsap.from(card.querySelector('.tl-visual'), {
                scale: 0.75,
                rotate: i % 2 ? 8 : -8,
                autoAlpha: 0,
                duration: 0.9,
                ease: 'back.out(1.6)',
                scrollTrigger: { trigger: card, containerAnimation: h, start: 'left 88%', toggleActions: 'play none none reverse' },
              })
            })
          }
          q('.tl-card').forEach((card) => {
            const year = Number((card as HTMLElement).dataset.year)
            ScrollTrigger.create({
              trigger: card,
              containerAnimation: h,
              start: 'left 55%',
              onEnter: () => {
                q(`.tl-dot[data-year="${year}"]`).forEach((d) => d.classList.add('is-on'))
                if (year === 10) unlock('survived')
              },
              onLeaveBack: () => q(`.tl-dot[data-year="${year}"]`).forEach((d) => d.classList.remove('is-on')),
            })
          })
          q('.tl-count').forEach((el) => {
            const to = Number((el as HTMLElement).dataset.to)
            const obj = { v: 0 }
            ScrollTrigger.create({
              trigger: el,
              containerAnimation: h,
              start: 'left 75%',
              once: true,
              onEnter: () =>
                gsap.to(obj, { v: to, duration: reduce ? 0 : 2.2, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('en-IN')) }),
            })
          })

          // Drag to scrub (mouse only).
          let startX = 0
          let startY = 0
          let dragging = false
          const down = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return
            dragging = true
            startX = e.clientX
            startY = window.scrollY
            viewport.classList.add('is-dragging')
          }
          const move = (e: PointerEvent) => {
            if (!dragging) return
            const y = startY - (e.clientX - startX) * 1.2
            const l = lenisRef.current
            if (l) l.scrollTo(y, { immediate: true, force: true })
            else window.scrollTo(0, y)
          }
          const up = () => {
            dragging = false
            viewport.classList.remove('is-dragging')
          }
          viewport.addEventListener('pointerdown', down)
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
          return () => {
            viewport.removeEventListener('pointerdown', down)
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }
        }

        // Mobile / tablet: vertical diary.
        if (!reduce) {
          q('.tl-card, .tl-era').forEach((el, i) => {
            gsap.from(el, { y: 60, rotate: i % 2 ? 3 : -3, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
          })
        }
        q('.tl-count').forEach((el) => {
          const to = Number((el as HTMLElement).dataset.to)
          const obj = { v: 0 }
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => gsap.to(obj, { v: to, duration: reduce ? 0 : 2, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('en-IN')) }),
          })
        })
        const last = q('.tl-card[data-year="10"]')[0]
        if (last) ScrollTrigger.create({ trigger: last, start: 'top 70%', once: true, onEnter: () => unlock('survived') })
        return undefined
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="timeline" sectionRef={root} className="relative bg-white">
      <div className="tl-viewport relative overflow-hidden bg-blush-50 py-24 select-none lg:h-[100svh] lg:py-0 [&.is-dragging]:cursor-grabbing">
        {/* header + progress (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden px-[6vw] lg:block">
          <div className="relative h-[3px] rounded-full bg-ink/10">
            <div className="tl-progress-fill absolute inset-0 origin-left scale-x-0 rounded-full bg-gradient-to-r from-blush-400 via-lilac-300 to-cloud-400" />
            <div className="absolute inset-0 flex items-center justify-between">
              {YEARS.map((y) => (
                <span key={y.year} data-year={y.year} className="tl-dot grid h-6 w-6 place-items-center rounded-full border-2 border-ink/15 bg-white text-[0.6rem] font-bold text-ink-mute transition-all duration-500 [&.is-on]:scale-125 [&.is-on]:border-blush-400 [&.is-on]:bg-blush-400 [&.is-on]:text-white">
                  {y.year}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="tl-track relative flex flex-col gap-10 px-5 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[5vw] lg:pr-[14vw] lg:pl-[7vw]">
          {/* vertical line for mobile */}
          <div aria-hidden className="absolute top-0 bottom-0 left-[38px] w-[2px] bg-gradient-to-b from-blush-200 via-lilac-200 to-cloud-200 lg:hidden" />

          <div className="relative shrink-0 lg:w-[34vw] lg:max-w-[520px]">
            <p className="eyebrow text-blush-600">The timeline</p>
            <h2 className="display mt-3 text-[clamp(2.8rem,6vw,5.4rem)] text-ink">
              Ten years.
              <br />
              <em className="text-blush-500">One</em> very long
              <br />
              group project.
            </h2>
            <p className="mt-5 max-w-sm text-lg text-ink-soft">Recreated from memory, with mild exaggeration and zero regrets.</p>
            <p className="hand mt-6 hidden items-center gap-2 text-2xl text-ink-mute lg:flex">
              scroll or drag
              <Doodle name="arrow" className="w-20 text-blush-400" />
            </p>
          </div>

          {ERAS.map((era) => (
            <EraBlock key={era.id} era={era} years={YEARS.filter((y) => y.era === era.id)} />
          ))}

          <div className="relative ml-12 shrink-0 rounded-[28px] border-2 border-dashed border-blush-300 bg-white/70 p-8 lg:ml-0 lg:w-[min(30vw,420px)]">
            <p className="eyebrow text-blush-600">Year 11</p>
            <p className="display mt-2 text-4xl text-ink italic">loading…</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-blush-100">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blush-400 to-blush-500" />
            </div>
            <p className="mt-3 text-sm text-ink-mute">Status: pending your approval. (See: the end of this website.)</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function EraBlock({ era, years }: { era: Era; years: YearCard[] }) {
  return (
    <>
      <div data-tint={era.tint} className="tl-era relative ml-12 max-w-[520px] shrink-0 lg:ml-0 lg:w-[min(30vw,440px)] lg:max-w-none">
        <span aria-hidden className="absolute top-3 -left-[34px] h-5 w-5 rounded-full border-4 border-white shadow lg:hidden" style={{ background: era.accent }} />
        <p className="eyebrow" style={{ color: era.accent }}>
          {era.years}
        </p>
        <h3 className="display mt-2 text-[clamp(2.2rem,4vw,3.6rem)] text-ink italic">{era.name}</h3>
        <div className="mt-5 space-y-1">
          {era.id === 'chaos' ? (
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-ink">
                Arguments: <span className="tl-count tabular-nums" data-to="1000">0</span>+
              </p>
              <p className="text-2xl font-semibold text-ink">
                Friendship ended permanently: <span className="text-blush-500">0</span>
              </p>
            </div>
          ) : (
            era.tagline.map((t) => (
              <p key={t} className="hand text-[2rem] leading-tight text-ink-soft">
                {t}
              </p>
            ))
          )}
        </div>
      </div>
      {years.map((y, i) => (
        <YearCardView key={y.year} y={y} accent={era.accent} tilt={i % 2 ? 1.5 : -1.5} />
      ))}
    </>
  )
}

function YearCardView({ y, accent, tilt }: { y: YearCard; accent: string; tilt: number }) {
  const p = y.photo ? photo(y.photo) : undefined
  return (
    <article data-year={y.year} className="tl-card relative ml-12 max-w-[520px] shrink-0 lg:ml-0 lg:w-[min(26vw,380px)] lg:max-w-none" style={{ rotate: `${tilt}deg` }}>
      <span aria-hidden className="absolute top-6 -left-[31px] h-3 w-3 rounded-full bg-white ring-4 lg:hidden" style={{ ['--tw-ring-color' as string]: accent }} />
      <div className="rounded-[26px] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(43,29,47,.35)]">
        <div className="tl-visual relative overflow-hidden rounded-[18px]">
          {p ? (
            <PhotoImg photo={p} className="aspect-[4/3]" sizes="(max-width: 1024px) 85vw, 380px" />
          ) : y.scene ? (
            <MiniScene id={y.scene} className="block aspect-[4/3] h-auto w-full" />
          ) : null}
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold tracking-widest text-ink shadow-sm">
            YEAR {String(y.year).padStart(2, '0')}
          </span>
        </div>
        <div className="px-3 pt-4 pb-3">
          <h4 className={cn('display text-[1.65rem] leading-tight text-ink')}>{y.title}</h4>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">{y.text}</p>
          {y.note && (
            <p className="hand mt-3 text-xl" style={{ color: accent }}>
              ↳ {y.note}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
