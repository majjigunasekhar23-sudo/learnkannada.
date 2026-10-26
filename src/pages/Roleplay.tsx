import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, User } from 'lucide-react';
import { getSituationBySlug } from '@/lib/content';
import type { RoleplayStep } from '@/lib/types';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';
import SpeakButton from '@/components/SpeakButton';
import { unlockAchievement } from '@/lib/progress';

type AnswerState = 'idle' | 'correct' | 'try-again';

export default function Roleplay() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const situation = getSituationBySlug(slug);
  const { setState } = useProgress();
  const { prefs } = usePrefs();

  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<AnswerState>('idle');
  const [completed, setCompleted] = useState(false);

  if (!situation || !situation.roleplay || !situation.available) {
    return (
      <div className="card p-6 text-center">
        <p className="text-ink-500">No role-play for this situation yet.</p>
        <button type="button" onClick={() => navigate('/app')} className="btn-primary mt-4">Back to home</button>
      </div>
    );
  }

  const rp = situation.roleplay;
  const step: RoleplayStep = rp.steps[stepIdx];

  function pick(i: number) {
    setPicked(i);
    const opt = step.options[i];
    if (opt.correct) {
      setPhase('correct');
      setState((s) => unlockAchievement(s, 'roleplay-correct'));
    } else {
      setPhase('try-again');
    }
  }

  function next() {
    if (stepIdx + 1 < rp.steps.length) {
      setStepIdx(stepIdx + 1);
      setPicked(null);
      setPhase('idle');
    } else {
      setCompleted(true);
    }
  }

  function restart() {
    setStepIdx(0);
    setPicked(null);
    setPhase('idle');
    setCompleted(false);
  }

  if (completed) {
    return (
      <div className="space-y-5">
        <BackLink slug={situation.slug} />
        <div className="card p-6 text-center animate-pop-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-600 grid place-items-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl text-ink-500 mb-2">Dialogue complete</h1>
          <p className="text-ink-400 mb-6">You worked through the whole exchange. Try saying the replies out loud next.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" onClick={restart} className="btn-secondary flex-1">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
            <Link to={`/app/speaking/${situation.slug}`} className="btn-primary flex-1">
              Speaking practice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BackLink slug={situation.slug} />
      <div className="card p-5">
        <p className="text-xs text-saffron-600 font-semibold uppercase tracking-widest mb-1">Role-play</p>
        <h1 className="text-xl text-ink-500 mb-1">{rp.title}</h1>
        <p className="text-sm text-ink-400">{rp.intro}</p>
        <div className="flex items-center gap-1.5 mt-3">
          {rp.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? 'bg-brand-500' : 'bg-neutraltint-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Driver line */}
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-ink-100 text-ink-400 grid place-items-center shrink-0" aria-hidden="true">
          <User className="w-5 h-5" />
        </div>
        <div className="card p-4 flex-1 bg-neutraltint-50">
          <p className="text-[11px] uppercase tracking-wide text-ink-300 mb-1">Driver</p>
          <p className="kannada text-xl text-ink-500">{step.line}</p>
          {prefs.showTranslit && <p className="text-sm text-ink-400 mt-1">{step.lineTranslit}</p>}
          <p className="text-xs text-ink-300 italic mt-1">{step.lineEnglish}</p>
          <div className="mt-3">
            <SpeakButton text={step.line} label="Hear driver" />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <p className="text-sm text-ink-400 px-1">Your reply:</p>
        {step.options.map((opt, i) => {
          const isPicked = picked === i;
          const show = isPicked && phase !== 'idle';
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={phase === 'correct'}
              className={`w-full text-left card p-4 transition-all tap disabled:opacity-70 ${
                show && opt.correct ? 'ring-2 ring-brand-500 border-brand-200 bg-brand-50' : ''
              } ${show && !opt.correct ? 'ring-2 ring-terracotta-400 border-terracotta-200 bg-terracotta-50' : ''} ${
                !show ? 'hover:border-brand-200' : ''
              }`}
            >
              <p className="kannada text-lg text-ink-500">{opt.text}</p>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase !== 'idle' && picked !== null && (
        <div className={`card p-4 animate-fade-in ${phase === 'correct' ? 'bg-brand-50 border-brand-200' : 'bg-saffron-50 border-saffron-200'}`}>
          <p className={`text-sm font-medium ${phase === 'correct' ? 'text-brand-700' : 'text-saffron-600'}`}>
            {step.options[picked].feedback}
          </p>
          {phase === 'correct' ? (
            <button type="button" onClick={next} className="btn-primary mt-3">
              {stepIdx + 1 < rp.steps.length ? 'Next line' : 'Finish'} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={() => setPhase('idle')} className="btn-secondary mt-3">
              <RefreshCw className="w-4 h-4" /> Listen once more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function BackLink({ slug }: { slug: string }) {
  return (
    <Link to={`/app/lesson/${slug}`} aria-label="Back to lesson" className="btn-ghost !p-2 tap w-fit">
      <ArrowLeft className="w-5 h-5" />
    </Link>
  );
}
