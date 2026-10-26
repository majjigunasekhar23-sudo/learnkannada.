import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getService } from './service';
import {
  loadProgress,
  markActive,
  saveProgress,
  type ProgressState,
} from './progress';

interface ProgressContextValue {
  state: ProgressState;
  setState: (updater: (s: ProgressState) => ProgressState) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setRawState] = useState<ProgressState>(() => markActive(loadProgress()));

  useEffect(() => {
    // Prime speech voices once on first load
    import('./speech').then((m) => m.primeVoices()).catch(() => {});
  }, []);

  // Keep a fresh "active" stamp on mount
  useEffect(() => {
    const next = markActive(state);
    if (next !== state) {
      setRawState(next);
      saveProgress(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setState = useCallback((updater: (s: ProgressState) => ProgressState) => {
    setRawState((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ state, setState }), [state, setState]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}

// Re-export for convenience so components can import from one place
export { getService };
