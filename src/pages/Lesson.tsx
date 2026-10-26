import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MessageCircle, Mic } from 'lucide-react';
import { getSituationBySlug } from '@/lib/content';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';
import PhraseCard from '@/components/PhraseCard';
import {
  completeLesson,
  markPhraseSeen,
  markDifficult,
  recordSelfRating,
  unsavePhrase,
  savePhrase,
  isPhraseSaved,
} from '@/lib/progress';

export default function Lesson() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const situation = getSituationBySlug(slug);
  const { state, setState } = useProgress();
  const { prefs } = usePrefs();

  useEffect(() => {
    if (!situation) return;
    situation.phrases.forEach((p) => setState((s) => markPhraseSeen(s, p.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situation?.id]);

  if (!situation || !situation.available) {
    return (
      <div className="card p-6 text-center">
        <p className="text-ink-500">That situation isn't available yet.</p>
        <button type="button" onClick={() => navigate('/app')} className="btn-primary mt-4">Back to home</button>
      </div>
    );
  }

  function audioPath(phraseId: string): string | undefined {
    // Convention: /audio/<situationId>-<phraseId>.mp3 — optional, only present if user adds a file.
    // We don't assume it exists; SpeakButton probes gracefully.
    return undefined;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/app" aria-label="Back to home" className="btn-ghost !p-2 tap">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-xs text-ink-300 uppercase tracking-wide">Lesson</p>
          <h1 className="text-2xl text-ink-500">{situation.title}</h1>
        </div>
      </div>

      <p className="text-ink-400 text-sm">{situation.subtitle}. Work through each phrase, listen, and save the ones you want to review later.</p>

      <div className="space-y-4">
        {situation.phrases.map((p, i) => {
          const saved = isPhraseSaved(state, p.id);
          const entry = state.savedPhrases.find((s) => s.id === p.id);
          const rating = state.selfRatings[p.id];
          return (
            <div key={p.id} className="relative">
              <span className="absolute -top-2 left-3 chip bg-white border border-neutraltint-200 text-ink-300 text-[11px] z-10">
                {i + 1}
              </span>
              <PhraseCard
                phrase={p}
                situationId={situation.id}
                prefs={prefs}
                saved={saved}
                difficult={entry?.difficult ?? false}
                rating={rating}
                onSave={() => setState((s) => (isPhraseSaved(s, p.id) ? unsavePhrase(s, p.id) : savePhrase(s, p.id, situation.id)))}
                onToggleDifficult={() => setState((s) => markDifficult(s, p.id, situation.id))}
                onRate={(n) => setState((s) => recordSelfRating(s, p.id, n))}
                audioPath={audioPath(p.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Next steps */}
      <div className="card p-5">
        <h2 className="text-lg text-ink-500 mb-3">Now practise it</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to={`/app/roleplay/${situation.slug}`} className="btn-secondary justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-brand-600" /> Role-play dialogue
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={`/app/speaking/${situation.slug}`} className="btn-secondary justify-between">
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-brand-600" /> Speaking practice
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            setState((s) => completeLesson(s, situation.id));
            navigate('/app/progress');
          }}
          className="btn-primary w-full mt-4"
        >
          Mark lesson complete
        </button>
      </div>
    </div>
  );
}
