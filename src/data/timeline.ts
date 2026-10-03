import type { PhotoId } from './photos'

export type MiniScene = 'bench' | 'tiffin' | 'laugh' | 'storm' | 'levelup' | 'chat' | 'eyes'

export interface Era {
  id: string
  name: string
  years: string
  tagline: string[]
  /** Background tint for the era. */
  tint: string
  accent: string
}

export interface YearCard {
  year: number
  era: string
  title: string
  text: string
  note?: string
  photo?: PhotoId
  scene?: MiniScene
}

export const ERAS: Era[] = [
  {
    id: 'school',
    name: 'School Era',
    years: 'Years 1–3',
    tagline: ['Two kids.', 'Zero maturity.', 'Unlimited confidence.'],
    tint: '#fff6f9',
    accent: '#f2678f',
  },
  {
    id: 'friendship',
    name: 'Friendship Era',
    years: 'Years 4–5',
    tagline: ['Somehow,', 'the friendship', 'survived.'],
    tint: '#f3f9ff',
    accent: '#4a9fdf',
  },
  {
    id: 'chaos',
    name: 'Chaos Era',
    years: 'Years 6–8',
    tagline: ['Arguments: 1000+', 'Friendship ended', 'permanently: 0'],
    tint: '#f6f1ff',
    accent: '#9a7ee6',
  },
  {
    id: 'still',
    name: 'Still Here Era',
    years: 'Years 9–10',
    tagline: ['We grew up.', 'Allegedly.'],
    tint: '#fff3f0',
    accent: '#d94a75',
  },
]

export const YEARS: YearCard[] = [
  { year: 1, era: 'school', title: 'The Seating Plan', text: 'Someone decided we should sit near each other. That someone has a lot to answer for.', note: 'nobody suspected anything', scene: 'bench' },
  { year: 2, era: 'school', title: 'The Tiffin Treaty', text: 'Food sharing begins. It is never, ever fair.', note: 'the terms were never negotiated', scene: 'tiffin' },
  { year: 3, era: 'school', title: 'Inside Jokes', text: 'We start laughing at things nobody else understands. Teachers: concerned.', note: 'still not explaining them', scene: 'laugh' },
  { year: 4, era: 'friendship', title: '“Never Talking To You Again”', text: 'The first time one of us said it. It lasted until lunch.', note: 'record: unbroken', scene: 'storm' },
  { year: 5, era: 'friendship', title: 'Upgrade Unlocked', text: 'From “the person who sits near me” to “the person I tell everything to.”', note: 'no going back', scene: 'levelup' },
  { year: 6, era: 'chaos', title: 'Peak Drama', text: 'Replying “fine.” Saying “nothing.” Both of us knowing it was not nothing.', note: 'fine. fine. FINE.', scene: 'chat' },
  { year: 7, era: 'chaos', title: 'The Jealousy Arc', text: 'Someone talked to someone else. Someone else noticed. (Both. It was both of us.)', note: '👀', scene: 'eyes' },
  { year: 8, era: 'chaos', title: 'Real Talk', text: 'Somewhere between the jokes, we started talking about real things too.', note: 'the good kind of serious', photo: 'cafe-cocoa' },
  { year: 9, era: 'still', title: 'Grown Up (Allegedly)', text: 'New places. New outfits. Same idiot best friend (me).', note: 'growth?', photo: 'rooftop-flowers' },
  { year: 10, era: 'still', title: 'Still Standing', text: 'Ten years. Still here. Still annoying each other. Still friends.', note: 'the main characters', photo: 'river-mountains' },
]
