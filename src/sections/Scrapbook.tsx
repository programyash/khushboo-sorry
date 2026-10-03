import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { Doodle, HeartIcon } from '../components/Doodle'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photo, type PhotoId } from '../data/photos'
import { useIsDesktop } from '../hooks/useMedia'
import { gsap, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { KidHead } from '../scenes/Kid'

const LEAVES = 5

/** A digital scrapbook with real 3D page turns (single-page flipper on phones). */
export function Scrapbook() {
  const { reduced } = useExperience()
  const desktop = useIsDesktop()
  const root = useRef<HTMLElement>(null)
  const [flipped, setFlipped] = useState(0) // desktop: leaves turned (0…5)
  const [page, setPage] = useState(0) // mobile: page index (0…9)
  const [dir, setDir] = useState(1)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.sb-book'), {
        y: 100,
        rotateX: 28,
        autoAlpha: 0,
        transformPerspective: 1400,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.sb-book')[0], start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  const turnTo = (n: number) => {
    const next = Math.max(0, Math.min(LEAVES, n))
    if (next === flipped) return
    sound.page()
    setFlipped(next)
  }
  const goPage = (n: number) => {
    const next = Math.max(0, Math.min(FACES.length - 1, n))
    if (next === page) return
    sound.page()
    setDir(next > page ? 1 : -1)
    setPage(next)
  }

  const chapterLabel = desktop
    ? flipped === 0
      ? 'Cover'
      : flipped === LEAVES
        ? 'The end (for now)'
        : `Chapter ${flipped} of 4`
    : page === 0
      ? 'Cover'
      : page === FACES.length - 1
        ? 'The end (for now)'
        : `Chapter ${Math.ceil(page / 2)} of 4`

  return (
    <Section id="scrapbook" sectionRef={root} className="relative overflow-hidden bg-[#f6efe6] px-4 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(178,54,97,.12)_1px,transparent_1.2px)] [background-size:18px_18px]" />
      <header className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow text-blush-600">Handmade (digitally)</p>
        <h2 className="display mt-3 text-[clamp(2.6rem,7vw,5rem)] text-ink">
          The <em className="text-blush-500">scrapbook</em>
        </h2>
        <p className="mt-3 text-lg text-ink-soft">Four chapters. Zero regrets. (Several regrets.)</p>
      </header>

      <div className="sb-book relative mt-14 flex flex-col items-center">
        {desktop ? <Book flipped={flipped} onTurn={turnTo} /> : <Flipper page={page} dir={dir} onGo={goPage} reduced={reduced} />}

        <div className="mt-10 flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="btn-ghost whitespace-nowrap disabled:opacity-40"
            onClick={() => (desktop ? turnTo(flipped - 1) : goPage(page - 1))}
            disabled={desktop ? flipped === 0 : page === 0}
            aria-label="Previous page"
          >
            ← Back
          </button>
          <p className="min-w-[7.5rem] text-center font-mono text-xs text-ink-mute sm:min-w-[9rem] sm:text-sm" aria-live="polite">
            {chapterLabel}
          </p>
          <button
            type="button"
            className="btn-ghost whitespace-nowrap disabled:opacity-40"
            onClick={() => (desktop ? turnTo(flipped + 1) : goPage(page + 1))}
            disabled={desktop ? flipped === LEAVES : page === FACES.length - 1}
            aria-label="Next page"
          >
            Turn →
          </button>
        </div>
        <p className="hand mt-3 text-lg text-ink-mute">{desktop ? 'click a page to turn it' : 'swipe or tap the arrows'}</p>
      </div>
    </Section>
  )
}

function Book({ flipped, onTurn }: { flipped: number; onTurn: (n: number) => void }) {
  const shift = flipped === 0 ? '-25%' : flipped === LEAVES ? '25%' : '0%'
  return (
    <div className="relative [--pw:clamp(280px,36vw,450px)]" style={{ width: 'calc(var(--pw) * 2)', height: 'calc(var(--pw) * 1.32)', perspective: '2600px' }}>
      <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(.645,.045,.355,1)]" style={{ transform: `translateX(${shift})` }}>
        {/* soft shadow under the open book */}
        <div aria-hidden className="absolute inset-x-[4%] -bottom-6 h-10 rounded-[50%] bg-ink/25 blur-2xl" />
        {Array.from({ length: LEAVES }).map((_, i) => {
          const turned = i < flipped
          return (
            <div
              key={i}
              className="book-leaf absolute top-0 left-1/2 h-full w-1/2 cursor-pointer"
              style={{ transform: `rotateY(${turned ? -180 : 0}deg)`, zIndex: turned ? i + 1 : 20 - i }}
              onClick={() => onTurn(turned ? i : i + 1)}
              aria-hidden={turned ? i !== flipped - 1 : i !== flipped}
            >
              <div className="book-face front rounded-r-[14px] shadow-[2px_6px_24px_-8px_rgba(43,29,47,.35)]">
                {FACES[i * 2]}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink/15 to-transparent" />
              </div>
              <div className="book-face back rounded-l-[14px] shadow-[-2px_6px_24px_-8px_rgba(43,29,47,.35)]">
                {FACES[i * 2 + 1]}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink/15 to-transparent" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Flipper({ page, dir, onGo, reduced }: { page: number; dir: number; onGo: (n: number) => void; reduced: boolean }) {
  return (
    <div className="relative w-[min(90vw,400px)]" style={{ aspectRatio: '1 / 1.32', perspective: '1800px' }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page}
          custom={dir}
          className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_24px_50px_-20px_rgba(43,29,47,.45)]"
          style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden' }}
          variants={{
            enter: (d: number) => (d > 0 ? { rotateY: 0, zIndex: 0 } : { rotateY: -110, zIndex: 2 }),
            center: { rotateY: 0, zIndex: 1, transition: { duration: reduced ? 0 : 0.9, ease: [0.645, 0.045, 0.355, 1] } },
            exit: (d: number) =>
              d > 0
                ? { rotateY: -110, zIndex: 2, transition: { duration: reduced ? 0 : 0.9, ease: [0.645, 0.045, 0.355, 1] } }
                : { rotateY: 0, zIndex: 0, transition: { duration: reduced ? 0 : 0.9 } },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onGo(page + 1)
            else if (info.offset.x > 60) onGo(page - 1)
          }}
        >
          {FACES[page]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────── page content ───────────────────────── */

function Paper({ children, className, tone = 'paper' }: { children: ReactNode; className?: string; tone?: 'paper' | 'ruled' | 'grid' }) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden p-[7%] [container-type:inline-size]',
        tone === 'ruled' ? 'ruled' : tone === 'grid' ? 'grid-paper' : 'paper',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Snap({ id, caption, className, rotate = 0, tape = 'rgba(255,179,201,.8)' }: { id: PhotoId; caption: string; className?: string; rotate?: number; tape?: string }) {
  const p = photo(id)
  if (!p) return null
  return (
    <div className={cn('absolute', className)} style={{ rotate: `${rotate}deg` }}>
      <span className="tape -top-[0.6cqw] left-1/2 h-[5cqw] w-[20cqw] -translate-x-1/2" style={{ ['--tape' as string]: tape }} />
      <div className="bg-white p-[2.2cqw] pb-[9cqw] shadow-[0_10px_24px_-10px_rgba(43,29,47,.4)]">
        <PhotoImg photo={p} className="aspect-[4/5] w-full" sizes="220px" />
        <p className="hand absolute right-[2cqw] bottom-[2cqw] left-[2cqw] truncate text-center text-[4.6cqw] text-ink-soft">{caption}</p>
      </div>
    </div>
  )
}

function ChapterTitle({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <>
      <p className="eyebrow text-[2.6cqw] text-blush-600">Chapter {n}</p>
      <h3 className="display mt-[2cqw] text-[9cqw] leading-[1.02] text-ink">{title}</h3>
      <p className="hand mt-[3cqw] text-[5.4cqw] text-ink-mute">{note}</p>
    </>
  )
}

const FACES: ReactNode[] = [
  // 0 · cover
  <div key="cover" className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#ff9dbb,#f2678f)] p-[8%] text-white [container-type:inline-size]">
    <div aria-hidden className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_10px)]" />
    <div className="relative flex h-full flex-col items-center justify-center rounded-[3cqw] border-[0.8cqw] border-dashed border-white/70 text-center">
      <HeartIcon className="w-[16cqw] animate-beat" color="#fff" />
      <p className="display mt-[4cqw] text-[12cqw] leading-none italic">Our Scrapbook</p>
      <p className="mt-[3cqw] text-[3.4cqw] font-bold tracking-[0.3em]">VOL. 10 · Y &amp; K</p>
      <p className="hand mt-[8cqw] text-[5.4cqw] text-white/90">handle with care (and snacks)</p>
    </div>
  </div>,

  // 1 · ch1 left
  <Paper key="c1l" tone="ruled">
    <ChapterTitle n={1} title="We had no idea this would last 10 years." note="year 1 · somewhere in a classroom" />
    <div className="absolute right-[8%] bottom-[8%] flex -space-x-[4cqw]">
      <KidHead who="khushboo" mood="smile" className="w-[26cqw]" />
      <KidHead who="yash" mood="happy" className="w-[26cqw]" />
    </div>
    <Doodle name="sparkle" className="absolute bottom-[34%] left-[10%] w-[9cqw] text-cloud-400" draw={false} />
  </Paper>,

  // 2 · ch1 right
  <Paper key="c1r">
    <div className="absolute top-[8%] left-[10%] w-[62%] rotate-[-4deg] border-[0.6cqw] border-dashed border-blush-300 bg-blush-50 p-[5cqw] text-center">
      <p className="text-[12cqw]">📷</p>
      <p className="hand mt-[2cqw] text-[6cqw] leading-tight text-ink">photo not found</p>
      <p className="hand text-[4.6cqw] text-ink-mute">we were too busy being idiots</p>
    </div>
    <div className="absolute right-[8%] bottom-[10%] w-[52%] rotate-[5deg] bg-[#fff3a8] p-[4cqw] shadow-[0_10px_20px_-10px_rgba(0,0,0,.3)]">
      <p className="hand text-[5.6cqw] leading-tight text-ink">
        Rule #1: sit together.
        <br />
        Rule #2: see rule #1.
      </p>
    </div>
  </Paper>,

  // 3 · ch2 left
  <Paper key="c2l" tone="grid">
    <ChapterTitle n={2} title="We became experts at arguing." note="certified. professionally." />
    <div className="absolute right-[8%] bottom-[9%] left-[8%] rounded-[3cqw] bg-white/80 p-[4cqw]">
      <p className="text-[3.4cqw] font-bold tracking-widest text-ink-mute">ARGUMENTS THIS WEEK</p>
      <svg viewBox="0 0 200 40" className="mt-[2cqw] w-full" aria-hidden>
        {Array.from({ length: 4 }).map((_, g) => (
          <g key={g} transform={`translate(${g * 50} 0)`} stroke="#f2678f" strokeWidth="3" strokeLinecap="round">
            {[4, 12, 20, 28].map((x) => (
              <path key={x} d={`M${x} 6 V34`} />
            ))}
            <path d="M0 30 L34 8" />
          </g>
        ))}
      </svg>
      <p className="hand mt-[1cqw] text-[5cqw] text-ink">time to make up: ~5 minutes</p>
    </div>
  </Paper>,

  // 4 · ch2 right
  <Paper key="c2r">
    <Snap id="wall-lean" caption="before the argument" className="top-[6%] left-[6%] w-[50%]" rotate={-6} />
    <Snap id="red-dress" caption="after. unbothered." className="right-[6%] bottom-[7%] w-[50%]" rotate={5} tape="rgba(157,208,246,.8)" />
  </Paper>,

  // 5 · ch3 left
  <Paper key="c3l" tone="ruled">
    <ChapterTitle n={3} title="We learned approximately nothing." note="lessons from 10 years:" />
    <ul className="mt-[4cqw] space-y-[1.6cqw] text-[4.6cqw] text-ink-soft">
      <li>☐ stop arguing</li>
      <li>☐ stop overthinking</li>
      <li className="text-ink">☑ steal food</li>
      <li className="text-ink">☑ laugh at absolutely nothing</li>
    </ul>
  </Paper>,

  // 6 · ch3 right
  <Paper key="c3r">
    <Snap id="bike-pov" caption="adventure mode" className="top-[5%] right-[6%] w-[54%]" rotate={4} />
    <Snap id="mirror-leaves" caption="mirror selfie mode" className="bottom-[6%] left-[6%] w-[48%]" rotate={-5} tape="rgba(200,182,246,.8)" />
  </Paper>,

  // 7 · ch4 left
  <Paper key="c4l" tone="grid">
    <ChapterTitle n={4} title="Somehow, still here." note="ten years later. same idiots. better memories." />
    <HeartIcon className="absolute right-[10%] bottom-[10%] w-[24cqw] animate-beat" color="#ff8fb0" />
  </Paper>,

  // 8 · ch4 right
  <Paper key="c4r">
    <Snap id="snow-lake" caption="cold place" className="top-[4%] left-[5%] w-[46%]" rotate={-5} />
    <Snap id="birthday-white" caption="celebration" className="top-[10%] right-[5%] w-[44%]" rotate={6} tape="rgba(157,208,246,.8)" />
    <Snap id="lehenga-twirl" caption="the twirl" className="bottom-[4%] left-[27%] w-[46%]" rotate={-2} tape="rgba(200,182,246,.8)" />
  </Paper>,

  // 9 · back cover
  <div key="back" className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#9dd0f6,#6db6ec)] p-[10%] text-center text-white [container-type:inline-size]">
    <p className="display text-[11cqw] leading-none italic">To be continued…</p>
    <p className="mt-[5cqw] text-[4.4cqw] leading-relaxed text-white/90">Chapter 5 requires your signature.</p>
    <p className="hand mt-[2cqw] text-[5.4cqw]">(see: the end of this website)</p>
  </div>,
]
