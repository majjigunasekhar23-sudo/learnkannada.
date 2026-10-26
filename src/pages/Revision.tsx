import { Link } from 'react-router-dom';
import { Bookmark, Flag, RefreshCw, Repeat, Check } from 'lucide-react';
import { getAllSituations } from '@/lib/content';
import type { Phrase } from '@/lib/types';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';
import SpeakButton from '@/components/SpeakButton';
import { dueReviews, reviewPhrase } from '@/lib/progress';

interface Enriched {
  phrase: Phrase;
  situationId: string;
  situationTitle: string;
  difficult: boolean;
  due: boolean;
}

export default function Revision() {
  const situations = getAllSituations();
  const { state, setState } = useProgress();
  const { prefs } = usePrefs();

  const saved = state.savedPhrases.map((sp) => {
    const sit = situations.find((s) => s.id === sp.situationId);
    const phrase = sit?.phrases.find((p) => p.id === sp.id);
    if (!sit || !phrase) return null;
    const reviewItem = state.reviewQueue.find((q) => q.phraseId === sp.id);
    return {
      phrase,
      situationId: sit.id,
      situationTitle: sit.title,
      difficult: sp.difficult,
      due: reviewItem ? reviewItem.dueAt <= Date.now() : false,
    } as Enriched;
  }).filter(Boolean) as Enriched[];

  const difficult = saved.filter((s) => s.difficult);
  const due = dueReviews(state);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Repeat className="w-6 h-6 text-brand-600" />
        <div>
          <p className="text-xs text-ink-300 uppercase tracking-wide">Revision</p>
          <h1 className="text-2xl text-ink-500">Saved & difficult phrases</h1>
        </div>
      </div>

      {saved.length === 0 && (
        <div className="card p-6 text-center">
          <Bookmark className="w-8 h-8 text-ink-300 mx-auto mb-2" />
          <p className="text-ink-500">No saved phrases yet.</p>
          <p className="text-sm text-ink-400 mt-1">Tap "Save phrase" on any lesson to add it here for spaced review.</p>
          <Link to="/app" className="btn-primary mt-4">Browse lessons</Link>
        </div>
      )}

      {saved.length > 0 && (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Saved" value={saved.length} />
            <Stat label="Difficult" value={difficult.length} />
            <Stat label="Due now" value={due.length} />
          </div>

          {/* Due reviews */}
          {due.length > 0 && (
            <div className="card p-4 bg-saffron-50 border-saffron-200">
              <p className="text-sm text-saffron-600 font-semibold mb-2">Up for review ({due.length})</p>
              <p className="text-xs text-ink-400 mb-3">Tap whether you still remember each phrase.</p>
              <ul className="space-y-2 list-none">
                {due.map((item) => {
                  const sit = situations.find((s) => s.id === item.situationId);
                  const phrase = sit?.phrases.find((p) => p.id === item.phraseId);
                  if (!phrase) return null;
                  return (
                    <li key={item.phraseId} className="flex items-center justify-between gap-2 bg-white rounded-xl p-3 border border-saffron-200">
                      <span className="kannada text-lg text-ink-500 truncate">{phrase.kannada}</span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setState((s) => reviewPhrase(s, item.phraseId, true))}
                          className="tap p-2 rounded-lg bg-brand-100 text-brand-700 hover:bg-brand-200"
                          aria-label={`Remembered: ${phrase.kannada}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setState((s) => reviewPhrase(s, item.phraseId, false))}
                          className="tap p-2 rounded-lg bg-terracotta-100 text-terracotta-500 hover:bg-terracotta-200"
                          aria-label={`Forgot: ${phrase.kannada}`}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* All saved phrases */}
          <div className="space-y-3">
            <h2 className="text-lg text-ink-500">All saved ({saved.length})</h2>
            {saved.map((s) => (
              <div key={s.phrase.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    {prefs.showKannada && <p className="kannada text-xl text-ink-500 truncate">{s.phrase.kannada}</p>}
                    {prefs.showTranslit && <p className="text-sm text-ink-400">{s.phrase.translit}</p>}
                    <p className="text-xs text-ink-300">
                      {s.situationTitle} · {s.phrase.english}
                    </p>
                  </div>
                  {s.difficult && (
                    <span className="chip bg-terracotta-100 text-terracotta-500 shrink-0">
                      <Flag className="w-3 h-3" /> Difficult
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SpeakButton text={s.phrase.kannada} label="Listen" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-2xl font-serif text-brand-700">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}
