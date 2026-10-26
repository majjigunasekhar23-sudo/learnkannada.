import type { Status } from './types';

export interface Feature {
  title: string;
  desc: string;
  status: Status;
}

export const FEATURES: Feature[] = [
  {
    title: 'Situation-based lessons',
    desc: 'Learn by real Bengaluru moments: taking an auto, buying at the market, ordering at a café, asking directions.',
    status: 'prototype',
  },
  {
    title: 'Listen with Kannada audio',
    desc: 'Hear each phrase with the browser speech engine, with graceful fallback to recorded files.',
    status: 'prototype',
  },
  {
    title: 'Save phrases & spaced review',
    desc: 'Save any phrase and see it again on a simple 1/3/7-day review queue.',
    status: 'prototype',
  },
  {
    title: 'Role-play dialogues',
    desc: 'Pick the right reply in a scripted driver–passenger conversation, with kind, shame-free feedback.',
    status: 'prototype',
  },
  {
    title: 'Speaking practice (self-rated)',
    desc: 'Record yourself, play it back, and rate your own effort. No automatic pronunciation scoring.',
    status: 'prototype',
  },
  {
    title: 'Explanation language toggle',
    desc: 'See meanings in Telugu or English. Toggle Kannada script and transliteration.',
    status: 'prototype',
  },
  {
    title: 'Progress & streaks',
    desc: 'Lessons completed, phrases learned, streaks, and achievements — from local data only.',
    status: 'prototype',
  },
  {
    title: 'Market, Café, Directions lessons',
    desc: 'Full lessons for the three other flagship situations.',
    status: 'mvp-plan',
  },
  {
    title: 'Speech-to-text feedback',
    desc: 'Optional speech recognition to show what you said (feature flag, off by default; accuracy untested).',
    status: 'future',
  },
  {
    title: 'AI conversation partner',
    desc: 'Free-form practice with a responsive conversation agent.',
    status: 'future',
  },
];

export interface FeatureRow {
  capability: string;
  textbook: Status | 'no';
  flashcardApp: Status | 'no';
  namma: Status | 'no';
}

export const COMPARISON: FeatureRow[] = [
  { capability: 'Built around everyday situations', textbook: 'no', flashcardApp: 'no', namma: 'prototype' },
  { capability: 'Listen + speak in context', textbook: 'no', flashcardApp: 'mocked', namma: 'prototype' },
  { capability: 'Spaced review of saved phrases', textbook: 'no', flashcardApp: 'mvp-plan', namma: 'prototype' },
  { capability: 'Telugu explanation for newcomers', textbook: 'no', flashcardApp: 'no', namma: 'prototype' },
  { capability: 'Designed for Bengaluru newcomers', textbook: 'no', flashcardApp: 'no', namma: 'prototype' },
];

export interface Metric {
  label: string;
  target: string;
}

export const PROPOSED_METRICS: Metric[] = [
  { label: 'Phrases learned per learner', target: 'TBD after pilot' },
  { label: 'Learners who complete the auto lesson', target: 'TBD after pilot' },
  { label: 'Self-rated speaking confidence (1–3)', target: 'TBD after pilot' },
  { label: '7-day retention', target: 'TBD after pilot' },
];

export interface LoopStep {
  n: number;
  title: string;
  desc: string;
}

export const LEARNING_LOOP: LoopStep[] = [
  { n: 1, title: 'Choose a situation', desc: 'Pick a real Bengaluru moment — an auto ride, the market.' },
  { n: 2, title: 'Learn phrases', desc: 'See Kannada, transliteration, and the meaning in your language.' },
  { n: 3, title: 'Listen', desc: 'Hear how each phrase sounds.' },
  { n: 4, title: 'Speak', desc: 'Record yourself and listen back.' },
  { n: 5, title: 'Practise a dialogue', desc: 'Pick the right reply in a role-play.' },
  { n: 6, title: 'Get feedback', desc: 'Kind, shame-free notes that help you try again.' },
  { n: 7, title: 'Revise', desc: 'Saved and tricky phrases come back on a simple spaced queue.' },
];

export const TARGET_USERS = [
  {
    title: 'Telugu-speaking students',
    desc: 'New to Bengaluru campuses, navigating autos, markets, and hostels.',
  },
  {
    title: 'Working professionals',
    desc: 'Moved to Bengaluru for work and want everyday spoken confidence.',
  },
  {
    title: 'Any newcomer',
    desc: 'Anyone who knows Kannada words but freezes in real conversations.',
  },
];
