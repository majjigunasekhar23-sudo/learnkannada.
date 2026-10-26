import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { getAllSituations } from '@/lib/content';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';
import SituationIcon from '@/components/SituationIcon';
import StatusBadge from '@/components/StatusBadge';

export default function Home() {
  const situations = getAllSituations();
  const { state } = useProgress();
  const { prefs } = usePrefs();

  return (
    <div className="space-y-6">
      <div className="card p-5 bg-gradient-to-br from-brand-500 to-brand-700 text-white border-brand-700">
        <div className="flex items-center gap-2 text-saffron-200 text-xs font-semibold uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" /> {prefs.explanationLang === 'te' ? 'నమ్మ కన్నಡ' : 'Namma Kannada'}
        </div>
        <h1 className="text-2xl font-serif text-white">Choose a situation</h1>
        <p className="text-brand-50/90 text-sm mt-1">
          Start with the auto lesson — it's fully built. The others are coming soon.
        </p>
      </div>

      <ul className="space-y-3 list-none">
        {situations.map((s) => {
          const done = state.completedLessons.includes(s.id);
          const phrasesLearned = s.available
            ? s.phrases.filter((p) => state.seenPhrases.includes(p.id)).length
            : 0;
          return (
            <li key={s.id}>
              {s.available ? (
                <Link
                  to={`/app/lesson/${s.slug}`}
                  className="card p-4 flex items-center gap-4 hover:border-brand-200 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                    <SituationIcon name={s.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg text-ink-500">{s.title}</h2>
                      <StatusBadge status={s.status} />
                      {done && <span className="chip bg-brand-100 text-brand-700">Completed</span>}
                    </div>
                    <p className="text-sm text-ink-400 truncate">{s.subtitle}</p>
                    {s.available && phrasesLearned > 0 && (
                      <p className="text-xs text-ink-300 mt-1">{phrasesLearned}/{s.phrases.length} phrases seen</p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-brand-600 shrink-0" />
                </Link>
              ) : (
                <div className="card p-4 flex items-center gap-4 opacity-80">
                  <div className="w-12 h-12 rounded-xl bg-neutraltint-200 text-ink-300 grid place-items-center shrink-0">
                    <SituationIcon name={s.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg text-ink-400">{s.title}</h2>
                      <span className="chip bg-ink-100 text-ink-400">
                        <Lock className="w-3 h-3" /> Coming soon
                      </span>
                    </div>
                    <p className="text-sm text-ink-300">{s.subtitle}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="card p-4 bg-saffron-50 border-saffron-200">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-saffron-600">Heads up:</span>{' '}
          All phrases are draft content and need validation by a fluent Kannada speaker before public release.
        </p>
      </div>
    </div>
  );
}
