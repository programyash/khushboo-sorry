import { useRef } from 'react'
import { Doodle } from '../components/Doodle'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { gsap, useGSAP } from '../lib/gsap'

type Row =
  | { label: string; kind: 'count'; from: number; to: number; suffix?: string; final?: string }
  | { label: string; kind: 'scramble'; text: string; redacted?: boolean }

const ROWS: Row[] = [
  { label: 'Years survived', kind: 'count', from: 0, to: 10 },
  { label: 'Arguments', kind: 'count', from: 0, to: 1000, suffix: '+' },
  { label: 'Food stolen', kind: 'scramble', text: 'CLASSIFIED', redacted: true },
  { label: 'Secrets shared', kind: 'scramble', text: 'Too many' },
  { label: 'Random conversations', kind: 'count', from: 0, to: 9999, final: '∞' },
  { label: 'Times friendship ended', kind: 'count', from: 99, to: 0 },
]

/** The friendship report card: animated stats, a grade and the teacher's remarks. */
export function StatusReport() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const card = q('.sr-card')[0]
      const values = q('.sr-value')
      if (reduced) {
        values.forEach((el, i) => {
          const r = ROWS[i]
          el.textContent = r.kind === 'count' ? (r.final ?? `${r.to.toLocaleString('en-IN')}${r.suffix ?? ''}`) : r.text
        })
        return
      }
      gsap.from(card, { y: 80, rotate: -2, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } })
      gsap.from(q('.sr-side > *'), { y: 50, autoAlpha: 0, stagger: 0.15, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: q('.sr-side')[0], start: 'top 80%' } })

      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 65%' } })
      q('.sr-row').forEach((row, i) => {
        const r = ROWS[i]
        const el = values[i]
        const at = i * 0.35
        tl.from(row, { x: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, at)
        if (r.kind === 'count') {
          const o = { v: r.from }
          tl.to(
            o,
            {
              v: r.to,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => (el.textContent = `${Math.round(o.v).toLocaleString('en-IN')}${r.suffix ?? ''}`),
              onComplete: () => {
                if (r.final) gsap.to(el, { duration: 0.6, scrambleText: { text: r.final, chars: '0123456789', speed: 0.8 } })
              },
            },
            at + 0.2,
          )
        } else {
          tl.to(el, { duration: 1.2, scrambleText: { text: r.text, chars: '█▓▒░', speed: 0.5 } }, at + 0.2)
        }
      })
      tl.from(q('.sr-status'), { scale: 2.4, rotate: -12, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)' }, '+=0.1')
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="status" sectionRef={root} className="relative overflow-hidden bg-cloud-50 px-4 py-24 sm:py-32">
      <div aria-hidden className="grid-paper absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <header className="text-center">
          <p className="eyebrow text-cloud-600">Official-ish document</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,6.5vw,4.8rem)] text-ink">
            Friendship <em className="text-cloud-500">status report</em>
          </h2>
        </header>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="sr-card relative rounded-[26px] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(47,127,191,.5)] sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-4">
              <p className="text-sm font-black tracking-[0.25em] text-ink">FRIENDSHIP STATUS</p>
              <p className="font-mono text-xs text-ink-mute">Academic year 10 · issued unofficially</p>
            </div>
            <dl className="mt-2">
              {ROWS.map((r) => (
                <div key={r.label} className="sr-row flex items-center justify-between gap-4 border-b border-dashed border-ink/15 py-4">
                  <dt className="text-[1.02rem] text-ink-soft sm:text-lg">{r.label}</dt>
                  <dd
                    className={`sr-value font-mono text-lg font-bold tabular-nums sm:text-2xl ${
                      r.kind === 'scramble' && r.redacted ? 'rounded bg-ink px-2 py-0.5 text-white' : 'text-ink'
                    }`}
                  >
                    {r.kind === 'count' ? r.from : '░░░░░'}
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <dt className="text-[1.02rem] font-semibold text-ink sm:text-lg">Current status</dt>
                <dd className="sr-status -rotate-3 rounded-xl border-[3px] border-blush-500 px-4 py-1.5 text-lg font-black tracking-wider text-blush-500 sm:text-xl">
                  STILL STANDING <span className="inline-block animate-beat">❤️</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="sr-side space-y-6">
            <div className="relative flex items-center gap-5 rounded-[26px] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(47,127,191,.5)]">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center">
                <Doodle name="ring" className="absolute inset-0 h-full w-full text-blush-400" strokeWidth={3} />
                <span className="display text-6xl text-blush-500 italic">A+</span>
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-[0.2em] text-ink-mute">OVERALL GRADE</p>
                <p className="hand mt-1 text-3xl text-ink">(despite everything)</p>
              </div>
            </div>
            <div className="relative rotate-1 rounded-[22px] bg-[#fff3a8] p-6 shadow-[0_16px_30px_-16px_rgba(0,0,0,.3)]">
              <span className="tape -top-3 left-8 -rotate-6" />
              <p className="text-xs font-extrabold tracking-[0.2em] text-ink/60">TEACHER’S REMARKS</p>
              <p className="hand mt-2 text-[1.75rem] leading-snug text-ink">
                Talks too much. Fights a lot. Makes up even faster. Would recommend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
