import phrasesData from '@/data/phrases.json';
import type { PhraseData, Situation } from './types';

const data = phrasesData as PhraseData;

export function getAllSituations(): Situation[] {
  return data.situations;
}

export function getSituation(id: string): Situation | undefined {
  return data.situations.find((s) => s.id === id);
}

export function getSituationBySlug(slug: string): Situation | undefined {
  return data.situations.find((s) => s.slug === slug);
}

export function isDraft(): boolean {
  return data.draft;
}
