import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/caveat'
import './styles/index.css'
import { App } from './App'

// Load the three typefaces before the first render so text splitting and
// scroll measurements see final metrics (no reflow jumps). Capped at 1.8s.
const FONTS = [
  '400 1em "Fraunces Variable"',
  'italic 400 1em "Fraunces Variable"',
  '500 1em "Plus Jakarta Sans Variable"',
  '600 1em "Caveat Variable"',
]
const ready = Promise.race([
  Promise.all(FONTS.map((f) => document.fonts.load(f))),
  new Promise((resolve) => setTimeout(resolve, 1800)),
]).catch(() => undefined)

void ready.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
