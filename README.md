# Khushboo, I made something. 💌

An interactive "I'm sorry" story for a 10-year friendship: part scrapbook, part mini-game, part apology letter.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (works from any host or sub-path)
npm run preview    # preview the production build
```

To share it, upload `dist/` to any static host (Netlify Drop, Vercel, GitHub Pages).

## The story (18 chapters)

| # | Chapter | What happens |
|---|---|---|
| 1 | Opening | Handwritten lines, "I'm sorry.", scroll-locked until **Okay… show me.** |
| 2 | 10 Years | Scroll-scrubbed rewind 10 → 1 with a photo flipbook, then **10 YEARS** |
| 3 | The Apology | Envelope opens with the scroll; the letter writes itself |
| 4 | Not Sorry | "But I'm not sorry that I met you." |
| 5 | Before You Judge Me | Tickable Terms & Conditions + the secret "don't touch this" sticker |
| 6 | Timeline | Horizontal, draggable 10-year timeline (vertical on phones) |
| 7 | School Diary | Animated classroom + recess illustrations |
| 8 | Friendship Chaos | 4-panel fight comic + jealousy scene with meters |
| 9 | Court Case | THE PEOPLE VS. YASH & KHUSHBOO → *Guilty of being idiots* |
| 10 | Status Report | Friendship report card with animated stats |
| 11 | The Quiet Part | Night falls; the emotional section |
| 12 | Museum | Gallery wall with plaques, a staff-only door, a draggable evidence board |
| 13 | Scrapbook | 3D page-turning book, four chapters |
| 14 | Level 1 | Quiz: "Do you actually know Yash?" (hearts, XP, badges) |
| 15 | One Last Question | YES ❤️ / the NO button that runs away |
| 16–18 | Ending | Unlocked only after YES: climax, final letter, photo heart, "fin." |

Hidden things: the school bell, the tiffin sticker (its answer changes after the quiz), the 😤 sticker, the staff-only door, the "don't touch this" heart, and 7 achievements in the 🏆 menu.

## Editing content

- `src/data/quiz.ts`: questions, answers, reactions
- `src/data/timeline.ts`: eras and the 10 year cards
- `src/data/photos.ts`: photo captions, alt text, museum plaques
- `src/sections/FinalLetter.tsx`: the final letter text
- `src/sections/Climax.tsx`: the "Jokes aside…" lines

### Photos

The originals were Instagram screenshots (not committed). They were cropped (Instagram dots, arrows and frames removed) and exported to WebP in `src/assets/photos/` as `<id>.webp` plus a 320px `<id>-sm.webp`. One screenshot was an unusable fragment and is not used.

To add a photo, drop `<id>.webp` and `<id>-sm.webp` into `src/assets/photos/` and add an entry to `RAW` in `src/data/photos.ts`. Missing files are skipped automatically, so there are no broken images.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText, ScrambleText, DrawSVG) · Motion · Lenis · canvas-confetti.
All illustrations are hand-built SVG (`src/scenes/`). Sound is synthesized with WebAudio and stays muted until turned on.

Accessibility: keyboard reachable throughout (including the NO button, which never traps focus), visible focus rings, alt text on every photo, and a `prefers-reduced-motion` mode that turns the scroll-driven scenes into static layouts and switches off looping animation and confetti. On desktop the timeline still moves sideways as you scroll.
