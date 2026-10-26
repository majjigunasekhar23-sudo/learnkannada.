import { Bookmark, BookmarkCheck, Star, Flag } from 'lucide-react';
import type { Phrase } from '@/lib/types';
import type { Prefs } from '@/lib/prefs';
import SpeakButton from './SpeakButton';

interface PhraseCardProps {
  phrase: Phrase;
  situationId: string;
  prefs: Prefs;
  saved: boolean;
  difficult: boolean;
  rating: number | undefined;
  onSave: () => void;
  onToggleDifficult: () => void;
  onRate: (n: number) => void;
  audioPath?: string;
}

export default function PhraseCard({
  phrase,
  situationId: _situationId,
  prefs,
  saved,
  difficult,
  rating,
  onSave,
  onToggleDifficult,
  onRate,
  audioPath,
}: PhraseCardProps) {
  return (
    <article className="card p-5 animate-pop-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Kannada script (toggleable) */}
        {prefs.showKannada ? (
          <p className="kannada text-2xl sm:text-3xl font-semibold text-ink-500 leading-tight">
            {phrase.kannada}
          </p>
        ) : (
          <p className="text-xl font-semibold text-ink-300 italic">Kannada hidden</p>
        )}
        <span className="chip bg-saffron-50 text-saffron-600 shrink-0" title="Draft content — needs validation">
          Draft phrase
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        {prefs.showTranslit && (
          <p className="text-base text-ink-400 font-medium">
            <span className="text-ink-300 text-xs uppercase tracking-wide mr-2">Say</span>
            {phrase.translit}
          </p>
        )}
        {prefs.explanationLang === 'te' && (
          <p className="telugu text-base text-ink-500">
            <span className="text-ink-300 text-xs uppercase tracking-wide mr-2">తెలుగు</span>
            {phrase.telugu}
          </p>
        )}
        <p className="text-sm text-ink-400">
          <span className="text-ink-300 text-xs uppercase tracking-wide mr-2">English</span>
          {phrase.english}
        </p>
        {phrase.use && (
          <p className="text-xs text-ink-300 italic pt-1 border-t border-neutraltint-200 mt-2">
            Use: {phrase.use}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton text={phrase.kannada} audioPath={audioPath} />
        <button
          type="button"
          onClick={onSave}
          className={saved ? 'btn-ghost !py-2 !px-3 text-sm text-brand-700' : 'btn-secondary !py-2 !px-3 text-sm'}
          aria-pressed={saved}
          aria-label={saved ? `Unsave phrase: ${phrase.kannada}` : `Save phrase: ${phrase.kannada}`}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save phrase'}
        </button>
        <button
          type="button"
          onClick={onToggleDifficult}
          className={`btn-ghost !py-2 !px-3 text-sm ${difficult ? 'text-terracotta-500' : ''}`}
          aria-pressed={difficult}
          aria-label={difficult ? `Remove from difficult: ${phrase.kannada}` : `Mark as difficult: ${phrase.kannada}`}
        >
          <Flag className="w-4 h-4" />
          {difficult ? 'Difficult' : 'Mark difficult'}
        </button>
      </div>

      {/* Self-rating (only when recording has been done) */}
      {rating !== undefined && (
        <div className="mt-4 pt-3 border-t border-neutraltint-200">
          <p className="text-xs text-ink-300 mb-1">Your self-rating</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onRate(n)}
                aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                className="star-btn"
              >
                <Star
                  className={`w-6 h-6 ${n <= rating ? 'text-saffron-400 fill-saffron-400' : 'text-neutraltint-300'}`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
