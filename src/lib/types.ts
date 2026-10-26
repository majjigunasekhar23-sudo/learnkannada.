export type Status = 'prototype' | 'mvp-plan' | 'future' | 'mocked';

export interface Phrase {
  id: string;
  kannada: string;
  translit: string;
  telugu: string;
  english: string;
  use?: string;
}

export interface RoleplayOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface RoleplayStep {
  speaker: 'driver' | 'passenger';
  line: string;
  lineTranslit: string;
  lineEnglish: string;
  options: RoleplayOption[];
}

export interface Roleplay {
  title: string;
  intro: string;
  steps: RoleplayStep[];
}

export interface Situation {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  status: Status;
  available: boolean;
  draft: boolean;
  phrases: Phrase[];
  roleplay: Roleplay | null;
}

export interface PhraseData {
  draft: boolean;
  note: string;
  situations: Situation[];
}
