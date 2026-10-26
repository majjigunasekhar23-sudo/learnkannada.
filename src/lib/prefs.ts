export type ExplanationLang = 'te' | 'en';
export type ScriptToggle = 'show' | 'hide';

export interface Prefs {
  explanationLang: ExplanationLang;
  showKannada: boolean;
  showTranslit: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  explanationLang: 'te',
  showKannada: true,
  showTranslit: true,
};

const KEY = 'namma-kannada:prefs';

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(p: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storage may be unavailable; ignore
  }
}

export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem('namma-kannada:onboarded') === '1';
  } catch {
    return false;
  }
}

export function setOnboarded(): void {
  try {
    localStorage.setItem('namma-kannada:onboarded', '1');
  } catch {
    // ignore
  }
}
