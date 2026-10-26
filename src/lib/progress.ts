/**
 * localStorage-backed progress for the MVP. All data is local to this device.
 * Optional FastAPI + Supabase persistence is stubbed via the service layer
 * in `service.ts` so it can be swapped in without touching UI code.
 */

export interface SavedPhrase {
  id: string;
  situationId: string;
  savedAt: number;
  difficult: boolean;
}

export interface ReviewItem {
  phraseId: string;
  situationId: string;
  dueAt: number;
  intervalDays: number; // current interval (1 -> 3 -> 7)
  reps: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  unlockedAt: number | null;
}

export interface ProgressState {
  savedPhrases: SavedPhrase[];
  reviewQueue: ReviewItem[];
  completedLessons: string[]; // situationIds
  seenPhrases: string[]; // phrase ids ever viewed
  streakDays: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  achievements: Achievement[];
  selfRatings: Record<string, number>; // phraseId -> 1..3
}

const KEY = 'namma-kannada:progress';

export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first-phrase', title: 'First phrase saved', desc: 'Saved your first phrase to review later.' },
  { id: 'first-lesson', title: 'First lesson done', desc: 'Completed the Taking an auto lesson.' },
  { id: 'roleplay-correct', title: 'Conversation starter', desc: 'Answered a role-play reply correctly.' },
  { id: 'speak-record', title: 'Spoke out loud', desc: 'Recorded yourself and played it back.' },
  { id: 'streak-3', title: '3-day streak', desc: 'Practised on three different days.' },
];

function emptyState(): ProgressState {
  return {
    savedPhrases: [],
    reviewQueue: [],
    completedLessons: [],
    seenPhrases: [],
    streakDays: 0,
    lastActiveDay: null,
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: null })),
    selfRatings: {},
  };
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    // Merge so newly-added achievements appear even in existing installs
    const base = emptyState();
    const merged: ProgressState = {
      ...base,
      ...parsed,
      achievements: ACHIEVEMENTS.map((a) => {
        const existing = parsed.achievements?.find((x) => x.id === a.id);
        return existing ? { ...existing, desc: a.desc, title: a.title } : { ...a, unlockedAt: null };
      }),
    };
    return merged;
  } catch {
    return emptyState();
  }
}

export function saveProgress(s: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Call on any app open / activity to update the streak. */
export function markActive(s: ProgressState): ProgressState {
  const today = todayKey();
  if (s.lastActiveDay === today) return s;
  let streak = s.streakDays;
  if (s.lastActiveDay) {
    const last = new Date(s.lastActiveDay + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
    if (diffDays === 1) streak += 1;
    else if (diffDays > 1) streak = 1; // missed days -> reset
  } else {
    streak = 1;
  }
  const next = { ...s, lastActiveDay: today, streakDays: streak };
  return maybeUnlock(next, 'streak-3', streak >= 3);
}

export function unlockAchievement(s: ProgressState, id: string): ProgressState {
  return maybeUnlock(s, id, true);
}

function maybeUnlock(s: ProgressState, id: string, cond: boolean): ProgressState {
  if (!cond) return s;
  const exists = s.achievements.find((a) => a.id === id);
  if (!exists || exists.unlockedAt) return s;
  return {
    ...s,
    achievements: s.achievements.map((a) =>
      a.id === id ? { ...a, unlockedAt: Date.now() } : a,
    ),
  };
}

export function markPhraseSeen(s: ProgressState, phraseId: string): ProgressState {
  if (s.seenPhrases.includes(phraseId)) return s;
  return { ...s, seenPhrases: [...s.seenPhrases, phraseId] };
}

export function savePhrase(s: ProgressState, phraseId: string, situationId: string): ProgressState {
  if (s.savedPhrases.some((p) => p.id === phraseId)) return s;
  const next: ProgressState = {
    ...s,
    savedPhrases: [...s.savedPhrases, { id: phraseId, situationId, savedAt: Date.now(), difficult: false }],
  };
  return maybeUnlock(next, 'first-phrase', true);
}

export function unsavePhrase(s: ProgressState, phraseId: string): ProgressState {
  return {
    ...s,
    savedPhrases: s.savedPhrases.filter((p) => p.id !== phraseId),
    reviewQueue: s.reviewQueue.filter((q) => q.phraseId !== phraseId),
  };
}

export function isPhraseSaved(s: ProgressState, phraseId: string): boolean {
  return s.savedPhrases.some((p) => p.id === phraseId);
}

export function toggleDifficult(s: ProgressState, phraseId: string, situationId: string): ProgressState {
  if (!s.savedPhrases.some((p) => p.id === phraseId)) {
    return savePhrase(s, phraseId, situationId);
  }
  return {
    ...s,
    savedPhrases: s.savedPhrases.map((p) =>
      p.id === phraseId ? { ...p, difficult: !p.difficult } : p,
    ),
  };
}

export function markDifficult(s: ProgressState, phraseId: string, situationId: string): ProgressState {
  let next = s;
  if (!next.savedPhrases.some((p) => p.id === phraseId)) {
    next = savePhrase(next, phraseId, situationId);
  }
  return {
    ...next,
    savedPhrases: next.savedPhrases.map((p) =>
      p.id === phraseId ? { ...p, difficult: true } : p,
    ),
  };
}

export function markEasy(s: ProgressState, phraseId: string): ProgressState {
  return {
    ...s,
    savedPhrases: s.savedPhrases.map((p) =>
      p.id === phraseId ? { ...p, difficult: false } : p,
    ),
  };
}

export function recordSelfRating(s: ProgressState, phraseId: string, rating: number): ProgressState {
  return { ...s, selfRatings: { ...s.selfRatings, [phraseId]: rating } };
}

export function completeLesson(s: ProgressState, situationId: string): ProgressState {
  if (s.completedLessons.includes(situationId)) return s;
  const next = { ...s, completedLessons: [...s.completedLessons, situationId] };
  return maybeUnlock(next, 'first-lesson', true);
}

export function addReview(s: ProgressState, phraseId: string, situationId: string): ProgressState {
  const existing = s.reviewQueue.find((q) => q.phraseId === phraseId);
  if (existing) return s;
  return {
    ...s,
    reviewQueue: [...s.reviewQueue, { phraseId, situationId, dueAt: Date.now() + 86400000, intervalDays: 1, reps: 0 }],
  };
}

const INTERVALS = [1, 3, 7];

export function reviewPhrase(s: ProgressState, phraseId: string, remembered: boolean): ProgressState {
  const item = s.reviewQueue.find((q) => q.phraseId === phraseId);
  if (!item) return s;
  let newInterval = item.intervalDays;
  let reps = item.reps;
  if (remembered) {
    reps += 1;
    const idx = INTERVALS.indexOf(item.intervalDays);
    newInterval = INTERVALS[Math.min(idx + 1, INTERVALS.length - 1)];
  } else {
    reps = 0;
    newInterval = INTERVALS[0];
  }
  const next = {
    ...s,
    reviewQueue: s.reviewQueue.map((q) =>
      q.phraseId === phraseId
        ? { ...q, intervalDays: newInterval, reps, dueAt: Date.now() + newInterval * 86400000 }
        : q,
    ),
  };
  return next;
}

export function dueReviews(s: ProgressState): ReviewItem[] {
  const now = Date.now();
  return s.reviewQueue.filter((q) => q.dueAt <= now);
}
