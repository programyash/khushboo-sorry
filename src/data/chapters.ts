/** Section ids + names, used for anchors and the chapter label in the HUD. */
export const CHAPTERS = {
  opening: 'Opening',
  tenYears: '10 Years',
  apology: 'The Apology',
  notSorry: 'Not Sorry About This',
  judge: 'Before You Judge Me',
  timeline: 'The Timeline',
  school: 'School Diary',
  chaos: 'Friendship Chaos',
  court: 'The Court Case',
  status: 'Status Report',
  quiet: 'The Quiet Part',
  museum: 'The Museum',
  scrapbook: 'The Scrapbook',
  quiz: 'Level 1',
  question: 'One Last Question',
  climax: 'Jokes Aside',
  letter: 'The Letter',
  finale: '10 Years Down',
} as const

export type ChapterId = keyof typeof CHAPTERS

export const CHAPTER_ORDER = Object.keys(CHAPTERS) as ChapterId[]
