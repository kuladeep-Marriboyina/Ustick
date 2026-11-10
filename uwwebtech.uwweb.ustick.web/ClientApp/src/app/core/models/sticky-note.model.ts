export enum StickyState {
  StuckHard = 0,   // Weak
  Peeling = 1,     // Improving
  AlmostGone = 2,  // Almost there
  Peeled = 3       // Mastered
}

export interface StickyNote {
  stickyNoteId: number;
  userId: number;
  subjectId: number;
  subjectName: string;
  topicId: number;
  topicName: string;
  takeaway: string;
  customNote: string | null;
  state: StickyState;
  stickiness: number;
  /** 0-100 mastery driving the ring. Earned by spaced retesting. */
  mastery: number;
  /** Consecutive strong (spaced) retests — resets on a weak attempt. */
  strongStreak: number;
  /** ISO date when this topic unlocks for its next retest (spaced repetition). */
  dueDate: string | null;
  accuracyPct: number;
  timesSeen: number;
  timesMissed: number;
  lastTestedDate: string | null;
  peeledDate: string | null;
  createdDate: string;
  modifiedDate: string;
}

export interface WallColumn {
  state: StickyState;
  title: string;
  notes: StickyNote[];
}

export interface WallResponse {
  userId: number;
  columns: WallColumn[];
  stuckCount: number;
  peeledCount: number;
}

export interface QuestionOption {
  key: string;
  text: string;
}

/** A same-concept question used when retesting a weak topic. */
export interface TopicQuestion {
  id: number;
  stem: string;
  options: QuestionOption[];
  correctKey: string;
  rationale: string;
}

export interface StageMeta {
  label: string;
  short: string;
  color: string;
  soft: string;
}

export const STAGE_META: Record<number, StageMeta> = {
  [StickyState.StuckHard]:  { label: 'Weak',         short: 'Weak',     color: '#E5484D', soft: '#FDECEC' },
  [StickyState.Peeling]:    { label: 'Improving',    short: 'Improving', color: '#E8910C', soft: '#FDF3E4' },
  [StickyState.AlmostGone]: { label: 'Almost there', short: 'Almost',   color: '#2F6BED', soft: '#EAF1FE' },
  [StickyState.Peeled]:     { label: 'Mastered',     short: 'Mastered', color: '#12B76A', soft: '#E6F7EF' }
};

/** Mastery -> stage. 100 = mastered (auto-graduates). */
export function stateForMastery(mastery: number): StickyState {
  if (mastery >= 100) { return StickyState.Peeled; }
  if (mastery >= 75)  { return StickyState.AlmostGone; }
  if (mastery >= 50)  { return StickyState.Peeling; }
  return StickyState.StuckHard;
}

/** A topic is retestable only when its cooldown has elapsed (spaced repetition). */
export function isDue(dueDate: string | null, now: Date): boolean {
  if (!dueDate) { return true; }
  return new Date(dueDate).getTime() <= now.getTime();
}

export function daysUntil(dueDate: string | null, now: Date): number {
  if (!dueDate) { return 0; }
  const ms = new Date(dueDate).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

/** A learner-selectable spaced-repetition strategy. */
export interface StrategyConfig {
  id: string;
  name: string;
  description: string;
  /** Cooldown (days) after the 1st, 2nd, 3rd… consecutive strong pass — expands for durability. */
  strongIntervals: number[];
  /** Cooldown (days) after a weak attempt. */
  weakInterval: number;
  /** Attempt accuracy (0-1) needed to count as a strong pass. */
  strongThreshold: number;
  /** Most mastery a single perfect retest can add. */
  gainCap: number;
  /** Most mastery a single weak retest can remove. */
  penalty: number;
  /** Must already be at/above this mastery to cross into 100% (Mastered). */
  gradFloor: number;
}

export const STRATEGY_PRESETS: StrategyConfig[] = [
  {
    id: 'proven', name: 'Proven',
    description: 'Expanding spaced repetition — the best strategy for long-term memory.',
    strongIntervals: [2, 4, 7, 14], weakInterval: 1, strongThreshold: 0.75,
    gainCap: 20, penalty: 14, gradFloor: 85
  },
  {
    id: 'cram', name: 'Cram',
    description: 'Tight cadence for an exam in a few days. Faster, less durable.',
    strongIntervals: [1, 1, 2, 3], weakInterval: 1, strongThreshold: 0.7,
    gainCap: 28, penalty: 10, gradFloor: 80
  },
  {
    id: 'relaxed', name: 'Relaxed',
    description: 'A gentler, forgiving pace with wider gaps.',
    strongIntervals: [3, 5, 9, 14], weakInterval: 2, strongThreshold: 0.6,
    gainCap: 18, penalty: 8, gradFloor: 85
  }
];

export const DEFAULT_STRATEGY: StrategyConfig = STRATEGY_PRESETS[0];

export interface DemoUser {
  id: number;
  name: string;
  initials: string;
  product: string;
}

/** Single demo student for this foundation pass (no login). */
export const DEMO_USER: DemoUser = {
  id: 1,
  name: 'Alex Carter',
  initials: 'AC',
  product: 'UWorld Legal'
};
