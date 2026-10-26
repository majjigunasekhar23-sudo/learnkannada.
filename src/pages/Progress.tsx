import { Link } from 'react-router-dom';
import { Award, Flame, BookCheck, MessagesSquare } from 'lucide-react';
import { getAllSituations } from '@/lib/content';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';

export default function Progress() {
  const situations = getAllSituations();
  const { state } = useProgress();
  const { prefs } = usePrefs();

  const lessonsDone = state.completedLessons.length;
  const phrasesLearned = state.seenPhrases.length;
  const savedCount = state.savedPhrases.length;
  const streak = state.streakDays;
  const unlockedAchievements = state.achievements.filter((a) => a.unlockedAt !== null);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-ink-300 uppercase tracking-wide">Your progress</p>
        <h1 className="text-2xl text-ink-500">How you're doing</h1>
        <p className="text-sm text-ink-400 mt-1">All data is stored only on this device, in your browser.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame className="w-5 h-5" />} label="Day streak" value={streak} accent="saffron" />
        <StatCard icon={<BookCheck className="w-5 h-5" />} label="Lessons completed" value={lessonsDone} accent="brand" />
        <StatCard icon={<MessagesSquare className="w-5 h-5" />} label="Phrases seen" value={phrasesLearned} accent="brand" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Phrases saved" value={savedCount} accent="saffron" />
      </div>

      {/* Lessons */}
      <div className="card p-5">
        <h2 className="text-lg text-ink-500 mb-3">Lessons</h2>
        <ul className="space-y-2 list-none">
          {situations.map((s) => {
            const done = state.completedLessons.includes(s.id);
            const seen = s.available ? s.phrases.filter((p) => state.seenPhrases.includes(p.id)).length : 0;
            return (
              <li key={s.id} className="flex items-center justify-between gap-2 py-2 border-b border-neutraltint-200 last:border-0">
                <div>
                  <p className={`text-sm ${s.available ? 'text-ink-500' : 'text-ink-300'}`}>{s.title}</p>
                  {s.available && <p className="text-xs text-ink-300">{seen}/{s.phrases.length} phrases seen</p>}
                </div>
                {done ? (
                  <span className="chip bg-brand-100 text-brand-700">Completed</span>
                ) : s.available ? (
                  <Link to={`/app/lesson/${s.slug}`} className="chip bg-neutraltint-200 text-ink-400 hover:text-brand-600">Open</Link>
                ) : (
                  <span className="chip bg-ink-100 text-ink-300">Soon</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Achievements */}
      <div className="card p-5">
        <h2 className="text-lg text-ink-500 mb-3">Achievements</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {state.achievements.map((a) => {
            const on = a.unlockedAt !== null;
            return (
              <div
                key={a.id}
                className={`rounded-xl p-4 border ${on ? 'bg-brand-50 border-brand-200' : 'bg-neutraltint-50 border-neutraltint-200 opacity-70'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className={`w-5 h-5 ${on ? 'text-brand-600' : 'text-ink-300'}`} />
                  <h3 className={`text-sm font-medium ${on ? 'text-ink-500' : 'text-ink-400'}`}>{a.title}</h3>
                </div>
                <p className="text-xs text-ink-400">{a.desc}</p>
                {!on && <p className="text-[11px] text-ink-300 mt-1">Not unlocked yet</p>}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-ink-300 text-center px-2">
        {prefs.explanationLang === 'te' ? 'మీ పురోగతి కేవలం ఈ పరికరంలో నిలువ ఉంది.' : 'Your progress lives only on this device.'}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: 'brand' | 'saffron';
}) {
  const ring = accent === 'brand' ? 'bg-brand-50 text-brand-600' : 'bg-saffron-50 text-saffron-600';
  return (
    <div className="card p-4">
      <div className={`w-9 h-9 rounded-lg grid place-items-center mb-2 ${ring}`}>{icon}</div>
      <p className="text-3xl font-serif text-ink-500">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}
