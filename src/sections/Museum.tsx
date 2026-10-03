import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photo, photos, STAFF_ONLY_PHOTO, type Photo, type PhotoId } from '../data/photos'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

const HALL: PhotoId[] = [
  'river-mountains',
  'lehenga-twirl',
  'night-stripes',
  'rooftop-flowers',
  'snow-lake',
  'cafe-cocoa',
  'birthday-white',
  'red-cafe',
  'mirror-leaves',
  'bike-pov',
  'lehenga-side',
]

/** x/y on desktop, mx/my on phones. */
const BOARD: { id: PhotoId; caption: string; x: string; y: string; mx: string; my: string; r: number }[] = [
  { id: 'armchair-stripes', caption: 'Evidence.', x: '4%', y: '8%', mx: '4%', my: '3%', r: -8 },
  { id: 'rooftop-teal', caption: 'She looked normal here. Suspicious.', x: '30%', y: '2%', mx: '52%', my: '5%', r: 5 },
  { id: 'wall-lean', caption: 'This was before the argument.', x: '56%', y: '10%', mx: '8%', my: '36%', r: -4 },
  { id: 'red-dress', caption: 'No further questions.', x: '12%', y: '48%', mx: '56%', my: '38%', r: 6 },
  { id: 'lehenga-pose', caption: '10 years of questionable decisions.', x: '40%', y: '46%', mx: '4%', my: '68%', r: -6 },
  { id: 'mirror-floral', caption: 'The mirror testified.', x: '72%', y: '44%', mx: '54%', my: '70%', r: 4 },
]

const SIZES = ['h-[420px]', 'h-[340px]', 'h-[380px]', 'h-[300px]']
const OFFSETS = ['mt-0', 'mt-16', 'mt-6', 'mt-24']

/** The Khushboo Museum: a gallery wall with plaques, a staff-only room, and an evidence board. */
export function Museum() {
  const { reduced, unlock } = useExperience()
  const root = useRef<HTMLElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const hall = photos(HALL)
  const [index, setIndex] = useState<number | null>(null)
  const [staffOpen, setStaffOpen] = useState(false)
  const [boardPhoto, setBoardPhoto] = useState<Photo | null>(null)
  const dragged = useRef(false)
  const staff = photo(STAFF_ONLY_PHOTO)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.mu-head > *'), { y: 40, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.mu-head')[0], start: 'top 80%' } })
      gsap.from(q('.mu-exhibit'), {
        y: 120,
        rotate: (i: number) => (i % 2 ? 6 : -6),
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: strip.current, start: 'top 80%' },
      })
      gsap.from(q('.mu-pin'), { y: -60, autoAlpha: 0, rotate: (i: number) => (i % 2 ? 30 : -30), stagger: 0.1, duration: 0.9, ease: 'back.out(1.8)', scrollTrigger: { trigger: board.current, start: 'top 75%' } })
    },
    { scope: root, dependencies: [reduced] },
  )

  // Mouse drag-to-scroll with a little inertia (touch uses native swipe).
  useEffect(() => {
    const el = strip.current
    if (!el) return
    let down = false
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let lastT = 0
    let v = 0
    let raf = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true
      dragged.current = false
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      lastT = performance.now()
      cancelAnimationFrame(raf)
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 6) dragged.current = true
      el.scrollLeft = startLeft - dx
      const now = performance.now()
      v = (e.clientX - lastX) / Math.max(1, now - lastT)
      lastX = e.clientX
      lastT = now
    }
    const onUp = () => {
      if (!down) return
      down = false
      let vel = v * 16
      const glide = () => {
        if (Math.abs(vel) < 0.4) return
        el.scrollLeft -= vel
        vel *= 0.93
        raf = requestAnimationFrame(glide)
      }
      if (!reduced) glide()
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [reduced])

  const nudge = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * Math.min(560, window.innerWidth * 0.7), behavior: reduced ? 'auto' : 'smooth' })
  const open = (i: number) => {
    if (dragged.current) return
    sound.click()
    setIndex(i)
  }
  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + hall.length) % hall.length)), [hall.length])
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % hall.length)), [hall.length])

  return (
    <Section id="museum" sectionRef={root} className="relative overflow-hidden bg-[#fbeef2] py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.55)_0_28px,transparent_28px_56px)]" />

      <header className="mu-head relative mx-auto max-w-4xl px-5 text-center">
        <p className="eyebrow text-blush-600">Now open · free entry</p>
        <h2 className="display mt-3 text-[clamp(2.6rem,7vw,5.4rem)] text-ink">
          The Khushboo <em className="text-blush-500">Museum</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          A permanent collection of evidence. Please do not touch the exhibits.
          <span className="hand ml-1 text-xl text-ink-mute">(you can touch the exhibits.)</span>
        </p>
      </header>

      {/* gallery wall */}
      <div className="relative mt-14">
        <div
          ref={strip}
          className="no-scrollbar relative flex snap-x snap-mandatory items-start gap-8 overflow-x-auto overscroll-x-contain px-[8vw] pt-6 pb-10 select-none sm:gap-14 lg:snap-none lg:px-[10vw]"
          style={{ cursor: 'grab' }}
          aria-label="Gallery of photos. Use the arrow buttons or swipe to browse."
          role="region"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') nudge(1)
            if (e.key === 'ArrowLeft') nudge(-1)
          }}
        >
          {hall.map((p, i) => (
            <figure key={p.id} className={cn('mu-exhibit relative shrink-0 snap-center', OFFSETS[i % OFFSETS.length])}>
              <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[140%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,255,255,.95),transparent)]" />
              <button
                type="button"
                onClick={() => open(i)}
                data-cursor="photo"
                data-cursor-label="view memory"
                aria-label={`Exhibit ${i + 1}: ${p.caption}`}
                className="group relative block rounded-[4px] bg-gradient-to-br from-[#e6c38c] via-[#f8e3b8] to-[#c99a5b] p-[7px] shadow-[0_30px_50px_-24px_rgba(43,29,47,.55)] transition-transform duration-500 hover:-translate-y-1.5"
              >
                <span className="block bg-white p-3 sm:p-4">
                  <PhotoImg
                    photo={p}
                    className={cn('w-auto max-w-[72vw] sm:max-w-none', SIZES[i % SIZES.length])}
                    style={{ aspectRatio: `${p.w} / ${p.h}` }}
                    sizes="(max-width: 640px) 72vw, 360px"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </span>
              </button>
              <figcaption className="mx-auto mt-5 w-[min(100%,260px)] rounded-md bg-white/90 px-4 py-3 text-left shadow-sm">
                <p className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-mute">EXHIBIT {String(i + 1).padStart(2, '0')}</p>
                <p className="display mt-1 text-lg leading-snug text-ink">{p.caption}</p>
                <p className="mt-1 text-xs text-ink-mute">
                  Medium: {p.medium} · Year: <span className="italic">classified</span>
                </p>
              </figcaption>
            </figure>
          ))}

          {/* staff only */}
          {staff && (
            <div className="mu-exhibit relative mt-24 shrink-0 snap-center">
              <button
                type="button"
                onClick={() => {
                  if (dragged.current) return
                  sound.boing()
                  setStaffOpen(true)
                  unlock('hunter')
                }}
                className="group flex h-[300px] w-[180px] flex-col items-center justify-center rounded-t-[90px] border-[6px] border-[#b5835a] bg-[#d9a77a] shadow-[0_30px_50px_-24px_rgba(43,29,47,.55)]"
                aria-label="A door marked Staff Only"
              >
                <span className="rounded bg-alert px-3 py-1 text-xs font-black tracking-widest text-white">STAFF ONLY</span>
                <span className="mt-3 text-sm font-semibold text-[#6e4529]">definitely don’t</span>
                <span className="mt-16 ml-24 h-4 w-4 rounded-full bg-[#ffd36e] shadow transition-transform group-hover:scale-125" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-3">
          <button type="button" onClick={() => nudge(-1)} className="btn-ghost !px-4" aria-label="Previous exhibits">
            ←
          </button>
          <p className="hand text-xl text-ink-mute">drag, swipe or click a frame</p>
          <button type="button" onClick={() => nudge(1)} className="btn-ghost !px-4" aria-label="Next exhibits">
            →
          </button>
        </div>
      </div>

      {/* evidence board */}
      <div className="relative mx-auto mt-24 max-w-6xl px-4 sm:mt-32">
        <div className="text-center">
          <p className="eyebrow text-cloud-600">Investigation room</p>
          <h3 className="display mt-2 text-4xl text-ink sm:text-5xl">The evidence board</h3>
          <p className="mt-2 text-ink-soft">Drag the evidence around. Investigate. Reach your own conclusions.</p>
        </div>
        <div
          ref={board}
          className="relative mt-8 h-[700px] overflow-hidden rounded-[26px] border-[10px] border-[#b5835a] bg-[#e3c49b] shadow-[inset_0_0_60px_rgba(110,69,41,.35),0_40px_80px_-40px_rgba(43,29,47,.5)] sm:h-[600px]"
        >
          <div aria-hidden className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(110,69,41,.35)_1px,transparent_1.2px)] [background-size:9px_9px]" />
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M14 14 L40 10 L68 18 L22 56 L52 52 L80 58" stroke="#e5484d" strokeWidth=".35" fill="none" />
          </svg>
          {BOARD.map((b) => {
            const p = photo(b.id)
            if (!p) return null
            return (
              <motion.div
                key={b.id}
                drag={!reduced}
                dragConstraints={board}
                dragElastic={0.15}
                dragMomentum
                whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30, boxShadow: '0 40px 60px -20px rgba(0,0,0,.45)' }}
                whileHover={{ scale: 1.03 }}
                className="absolute top-[var(--my)] left-[var(--mx)] w-[40%] max-w-[190px] cursor-grab touch-none active:cursor-grabbing sm:top-[var(--y)] sm:left-[var(--x)] sm:w-[22%]"
                style={{ rotate: b.r, ['--x' as string]: b.x, ['--y' as string]: b.y, ['--mx' as string]: b.mx, ['--my' as string]: b.my }}
                onDoubleClick={() => setBoardPhoto(p)}
              >
                <div className="mu-pin relative">
                  <span aria-hidden className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8fb0,#d94a75)] shadow" />
                  <div className="polaroid !pb-12">
                    <PhotoImg photo={p} className="pointer-events-none aspect-[4/5]" sizes="190px" />
                    <p className="hand absolute right-2 bottom-2 left-2 text-center text-[1.05rem] leading-tight text-ink-soft">{b.caption}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBoardPhoto(p)}
                  className="sr-only-focusable absolute top-2 right-2 rounded-full bg-ink px-2 py-1 text-xs text-white"
                >
                  Open photo: {b.caption}
                </button>
              </motion.div>
            )
          })}
        </div>
        <p className="hand mt-3 text-center text-lg text-ink-mute">tip: double-click a polaroid to take a closer look</p>
      </div>

      <Lightbox
        photo={index === null ? null : hall[index]}
        onClose={close}
        onPrev={prev}
        onNext={next}
        eyebrow={index === null ? undefined : `Exhibit ${String(index + 1).padStart(2, '0')} · ${hall[index].medium}`}
      />
      <Lightbox photo={boardPhoto} onClose={() => setBoardPhoto(null)} eyebrow="Evidence" />
      {staff && (
        <Lightbox
          photo={staffOpen ? staff : null}
          onClose={() => setStaffOpen(false)}
          eyebrow="Staff only · classified footage"
          title="You found evidence."
          note={<p>{staff.caption} This footage does not leave the museum.</p>}
        />
      )}
    </Section>
  )
}
