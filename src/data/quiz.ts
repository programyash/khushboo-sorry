import type { BadgeId } from './badges'

export type QuizMood = 'proud' | 'shocked' | 'smug' | 'dramatic'

export interface QuizQuestion {
  id: string
  /** Factual questions have right answers; opinion ones accept everything. */
  kind: 'fact' | 'opinion'
  question: string
  hint?: string
  options: string[]
  /** For facts: the correct option(s). Multi-select when more than one. */
  answer?: string[]
  correct?: { title: string; line?: string; emoji: string }
  wrong?: { title: string; line?: string; emoji: string }
  /** For opinion questions: a reaction per option. */
  reactions?: Record<string, { title: string; emoji: string }>
  badge?: BadgeId
  xp: number
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'girlfriend',
    kind: 'fact',
    question: 'Who was Yash’s girlfriend in school?',
    options: ['Yashasvi', 'Saniya', 'Aditi', 'Purvanshi'],
    answer: ['Yashasvi'],
    correct: { title: 'Okay wow… you actually remember.', line: 'Memory: elite. Gossip archive: fully intact.', emoji: '😳' },
    wrong: { title: 'KHUSHBOO. After TEN YEARS?!', line: 'It was Yashasvi. I’m choosing to be hurt about this.', emoji: '😵‍💫' },
    xp: 25,
  },
  {
    id: 'bench',
    kind: 'fact',
    question: 'Who was Yash’s bench and crime partner?',
    options: ['Imad', 'Kuldeep', 'Arideep', 'Surbhi'],
    answer: ['Imad'],
    correct: { title: 'The partner in academic crime has been identified.', line: 'The case files have been sealed. Imad sends regards.', emoji: '🕵️' },
    wrong: { title: 'Bruh.', line: 'It was Imad. The crime partner is deeply offended.', emoji: '🤦' },
    badge: 'crime',
    xp: 25,
  },
  {
    id: 'bestie',
    kind: 'fact',
    question: 'Who is Yash’s girl best friend?',
    hint: 'Choose 2 answers.',
    options: ['Aditi', 'Khushboo', 'Sakshi', 'Surbhi', 'Nanni'],
    answer: ['Aditi', 'Khushboo'],
    correct: { title: 'Correct. Both of you are stuck with me.', line: 'No refunds. No exchanges.', emoji: '🫶' },
    wrong: { title: 'Hmm. One of those should’ve been obvious.', line: 'The answer was Aditi & Khushboo. (Yes, you. Obviously you.)', emoji: '🙄' },
    xp: 25,
  },
  {
    id: 'tiffin',
    kind: 'fact',
    question: 'What did Yash eat in his tiffin with Khushboo?',
    options: ['Chana', 'Pasta', 'Maggi', 'Sandwich'],
    answer: ['Pasta'],
    correct: { title: 'THE PASTA HAS ENTERED THE CHAT.', line: '🍝 A legend never forgotten.', emoji: '🍝' },
    wrong: { title: 'It was PASTA.', line: 'The pasta is hurt. The pasta remembers you.', emoji: '🥲' },
    badge: 'pasta',
    xp: 25,
  },
  {
    id: 'nonsense',
    kind: 'opinion',
    question: 'Who usually started the nonsense?',
    hint: 'There are no wrong answers. (There are, but I’ll allow it.)',
    options: ['Yash', 'Khushboo', 'Both, simultaneously', 'The nonsense started itself'],
    reactions: {
      Yash: { title: 'Wow. Throwing me under the bus. Fair.', emoji: '🚌' },
      Khushboo: { title: 'Honesty! Character development!', emoji: '👏' },
      'Both, simultaneously': { title: 'Correct. We are a package deal of chaos.', emoji: '🤝' },
      'The nonsense started itself': { title: 'Diplomatic. You should be in politics.', emoji: '🎩' },
    },
    xp: 10,
  },
  {
    id: 'dramatic',
    kind: 'opinion',
    question: 'Who was more dramatic?',
    options: ['Yash', 'Khushboo', 'Don’t make me answer this'],
    reactions: {
      Yash: { title: 'I made a whole website. I can’t argue.', emoji: '🎭' },
      Khushboo: { title: 'I didn’t say it. You said it.', emoji: '🤐' },
      'Don’t make me answer this': { title: 'Respect. Some truths are too powerful.', emoji: '🫡' },
    },
    xp: 10,
  },
  {
    id: 'cameback',
    kind: 'opinion',
    question: 'Who said “I’m not talking to you” and then came back first?',
    options: ['Yash', 'Khushboo', 'Both, within 5 minutes'],
    reactions: {
      Yash: { title: 'Okay yes. My principles are weak. My friendship is strong.', emoji: '🥲' },
      Khushboo: { title: 'And I appreciated it every single time.', emoji: '🥹' },
      'Both, within 5 minutes': { title: 'Silent treatment world record: 4 minutes 59 seconds.', emoji: '⏱️' },
    },
    xp: 10,
  },
]

export const MAX_XP = QUIZ.reduce((sum, q) => sum + q.xp, 0)
export const FACT_COUNT = QUIZ.filter((q) => q.kind === 'fact').length

export function rankFor(factsRight: number) {
  if (factsRight >= 4) return { title: 'Certified Best Friend', tier: 'Platinum', line: 'You remember everything. It’s honestly a little scary.' }
  if (factsRight === 3) return { title: 'Best Friend', tier: 'Gold', line: 'Minor memory issues. Friendship fully intact.' }
  if (factsRight === 2) return { title: 'Friend Who Needs A Refresher', tier: 'Silver', line: 'We’ll schedule a revision class. With snacks.' }
  return { title: 'Are you sure you’re Khushboo?', tier: 'Bronze', line: 'Kidding. You’re still the only one who gets the website.' }
}
