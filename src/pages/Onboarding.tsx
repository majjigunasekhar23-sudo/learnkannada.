import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { usePrefs } from '@/components/PrefsProvider';
import { setOnboarded, type ExplanationLang } from '@/lib/prefs';
import { kannadaVoiceAvailable, primeVoices } from '@/lib/speech';
import { useProgress } from '@/lib/useProgress';

type Step = 'lang' | 'script' | 'audio' | 'done';

export default function Onboarding() {
  const { prefs, setPrefs } = usePrefs();
  const { setState } = useProgress();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('lang');
  const [audioReady] = useState<boolean>(() => kannadaVoiceAvailable());

  function finish() {
    setOnboarded();
    setState((s) => s); // touch progress to stamp active day
    navigate('/app');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-neutraltint-50 to-neutraltint-50 flex flex-col">
      <header className="px-4 h-14 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-serif font-semibold text-brand-700">
          <span className="kannada text-xl text-saffron-500">ನ</span>
          NammaKannada
        </Link>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-xs text-ink-300">
          {(['lang', 'script', 'audio', 'done'] as Step[]).map((s, i) => {
            const idx = (['lang', 'script', 'audio', 'done'] as Step[]).indexOf(step);
            const active = i <= idx;
            return (
              <span
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${active ? 'bg-brand-500' : 'bg-neutraltint-200'}`}
              />
            );
          })}
        </div>

        {step === 'lang' && (
          <div className="card p-6 animate-fade-in">
            <h1 className="text-2xl text-ink-500 mb-2">Welcome</h1>
            <p className="text-ink-400 mb-5">
              Let's set up how you'd like to learn. Which language should we explain Kannada in?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'te' as ExplanationLang, label: 'తెలుగు', sub: 'Telugu', cls: 'telugu' },
                { id: 'en' as ExplanationLang, label: 'English', sub: 'English', cls: '' },
              ]).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setPrefs({ explanationLang: o.id })}
                  className={`card p-4 text-left transition-all tap ${prefs.explanationLang === o.id ? 'ring-2 ring-brand-500 border-brand-200' : 'hover:border-brand-200'}`}
                  aria-pressed={prefs.explanationLang === o.id}
                >
                  <p className={`text-xl ${o.cls} text-ink-500`}>{o.label}</p>
                  <p className="text-sm text-ink-400">{o.sub}</p>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep('script')} className="btn-primary w-full mt-6">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'script' && (
          <div className="card p-6 animate-fade-in">
            <h1 className="text-2xl text-ink-500 mb-2">Show which scripts?</h1>
            <p className="text-ink-400 mb-5">You can change these anytime in settings.</p>
            <div className="space-y-3">
              <ToggleRow
                label="Kannada script"
                sample="ಆಟೋ ಬರ್ತೀರಾ?"
                sampleClass="kannada"
                checked={prefs.showKannada}
                onChange={(v) => setPrefs({ showKannada: v })}
              />
              <ToggleRow
                label="Transliteration"
                sample="Auto barteera?"
                checked={prefs.showTranslit}
                onChange={(v) => setPrefs({ showTranslit: v })}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setStep('lang')} className="btn-ghost flex-1">Back</button>
              <button type="button" onClick={() => setStep('audio')} className="btn-primary flex-1">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'audio' && (
          <div className="card p-6 animate-fade-in">
            <h1 className="text-2xl text-ink-500 mb-2">Listening & speaking</h1>
            <p className="text-ink-400 mb-5">
              NammaKannada uses your browser's speech engine to read Kannada phrases aloud. If a Kannada voice isn't installed, it gracefully switches to a recorded file (or asks you to add one).
            </p>
            <div className={`chip ${audioReady ? 'bg-brand-100 text-brand-700' : 'bg-terracotta-50 text-terracotta-500'} mb-4`}>
              {audioReady ? 'Kannada voice detected' : 'No Kannada voice yet — audio will fall back to recorded files'}
            </div>
            <p className="text-xs text-ink-300 mb-5">
              Speaking practice uses your microphone for self-recording only. We do not perform automatic pronunciation scoring.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep('script')} className="btn-ghost flex-1">Back</button>
              <button
                type="button"
                onClick={() => {
                  primeVoices();
                  setStep('done');
                }}
                className="btn-primary flex-1"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="card p-6 text-center animate-pop-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-600 grid place-items-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="text-2xl text-ink-500 mb-2">You're set</h1>
            <p className="text-ink-400 mb-6">
              Start with the flagship lesson: taking an auto. We've kept it simple — learn the phrases, listen, speak, and practise a short dialogue.
            </p>
            <button type="button" onClick={finish} className="btn-primary w-full">
              Start learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <footer className="px-4 py-4 text-center text-xs text-ink-300">
        <Link to="/" className="underline hover:text-brand-600">Back to landing</Link>
      </footer>
    </div>
  );
}

function ToggleRow({
  label,
  sample,
  sampleClass = '',
  checked,
  onChange,
}: {
  label: string;
  sample: string;
  sampleClass?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={`card p-4 flex items-center justify-between ${checked ? 'ring-2 ring-brand-500 border-brand-200' : ''}`}>
      <div>
        <p className="text-ink-500 font-medium">{label}</p>
        <p className={`text-base text-ink-400 ${sampleClass}`}>{sample}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-neutraltint-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-soft transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}
