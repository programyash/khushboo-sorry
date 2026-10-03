import { useEffect } from 'react'
import { Cursor } from './components/Cursor'
import { HUD } from './components/HUD'
import { Toasts } from './components/Toasts'
import { ExperienceProvider, useExperience } from './context/Experience'
import { ScrollTrigger } from './lib/gsap'
import { Hero } from './sections/Hero'
import { TenYears } from './sections/TenYears'
import { Apology } from './sections/Apology'
import { NotSorry } from './sections/NotSorry'
import { BeforeYouJudge } from './sections/BeforeYouJudge'
import { Timeline } from './sections/Timeline'
import { SchoolDiary } from './sections/SchoolDiary'
import { Chaos } from './sections/Chaos'
import { Court } from './sections/Court'
import { StatusReport } from './sections/StatusReport'
import { QuietPart } from './sections/QuietPart'
import { Museum } from './sections/Museum'
import { Scrapbook } from './sections/Scrapbook'
import { Quiz } from './sections/Quiz'
import { SorryQuestion } from './sections/SorryQuestion'
import { Climax } from './sections/Climax'
import { FinalLetter } from './sections/FinalLetter'
import { Finale } from './sections/Finale'

export function App() {
  return (
    <ExperienceProvider>
      <SkipLink />
      <Cursor />
      <HUD />
      <Toasts />
      <div className="grain" aria-hidden />
      <main id="story" className="relative overflow-x-clip">
        <Hero />
        <TenYears />
        <Apology />
        <NotSorry />
        <BeforeYouJudge />
        <Timeline />
        <SchoolDiary />
        <Chaos />
        <Court />
        <StatusReport />
        <QuietPart />
        <Museum />
        <Scrapbook />
        <Quiz />
        <SorryQuestion />
        <AfterYes />
      </main>
      <SyncScroll />
    </ExperienceProvider>
  )
}

/** Keyboard / screen-reader shortcut past the opening animation. */
function SkipLink() {
  const { start, scrollTo } = useExperience()
  return (
    <button
      type="button"
      onClick={() => {
        start()
        requestAnimationFrame(() => scrollTo('#apology', { immediate: true }))
      }}
      className="sr-only-focusable fixed top-3 left-3 z-[400] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
    >
      Skip to the apology
    </button>
  )
}

/**
 * Rendered last so it runs after every section has created its ScrollTriggers:
 * sort them into document order (pins first) and measure once.
 */
function SyncScroll() {
  useEffect(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])
  return null
}

/** The ending only exists once the apology is accepted. */
function AfterYes() {
  const { accepted } = useExperience()
  useEffect(() => {
    if (!accepted) return
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(id)
  }, [accepted])
  if (!accepted) return null
  return (
    <>
      <Climax />
      <FinalLetter />
      <Finale />
    </>
  )
}
