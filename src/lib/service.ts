/**
 * Service layer. The MVP persists everything to localStorage via `progress.ts`.
 * If/when FastAPI + Supabase are wired up, only this file changes — UI code
 * consumes `load()` and `save()` and stays untouched. This is a stub: it
 * reads/writes localStorage only and is not required to run the demo.
 */

import { loadProgress, saveProgress, type ProgressState } from './progress';

export interface SyncService {
  load(): ProgressState;
  save(state: ProgressState): void;
}

const local: SyncService = {
  load: loadProgress,
  save: saveProgress,
};

export function getService(): SyncService {
  return local;
}
