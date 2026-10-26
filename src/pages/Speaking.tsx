import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mic, Play, RefreshCw, Square, Star, Info } from 'lucide-react';
import { getSituationBySlug } from '@/lib/content';
import { useProgress } from '@/lib/useProgress';
import { usePrefs } from '@/components/PrefsProvider';
import { micSupported, createRecorder, type Recorder } from '@/lib/recording';
import { recordSelfRating, unlockAchievement } from '@/lib/progress';
import SpeakButton from '@/components/SpeakButton';

export default function Speaking() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const situation = getSituationBySlug(slug);
  const { state, setState } = useProgress();
  const { prefs } = usePrefs();

  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<Recorder | null>(null);

  if (!situation || !situation.available) {
    return (
      <div className="card p-6 text-center">
        <p className="text-ink-500">Speaking practice isn't available for this situation yet.</p>
        <button type="button" onClick={() => navigate('/app')} className="btn-primary mt-4">Back to home</button>
      </div>
    );
  }

  const phrase = situation.phrases[idx];
  const rating = state.selfRatings[phrase.id];
  const micOk = micSupported();

  async function startRecording() {
    if (!micOk) return;
    try {
      const r = createRecorder();
      recorderRef.current = r;
      await r.start();
      setRecording(true);
      setAudioUrl(null);
    } catch {
      setRecording(false);
    }
  }

  async function stopRecording() {
    const r = recorderRef.current;
    if (!r) return;
    setRecording(false);
    const url = await r.stop();
    setAudioUrl(url);
    setState((s) => unlockAchievement(s, 'speak-record'));
  }

  function reset() {
    setAudioUrl(null);
    setRecording(false);
  }

  return (
    <div className="space-y-5">
      <Link to={`/app/lesson/${situation.slug}`} aria-label="Back to lesson" className="btn-ghost !p-2 tap w-fit">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="card p-5">
        <p className="text-xs text-saffron-600 font-semibold uppercase tracking-widest mb-1">Speaking practice</p>
        <h1 className="text-xl text-ink-500 mb-1">Say it out loud</h1>
        <p className="text-sm text-ink-400">
          Record yourself saying the phrase, play it back, and rate how it sounded to you. This is self-rating only — we don't score your pronunciation.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-ink-300">Phrase {idx + 1} of {situation.phrases.length}</span>
          {situation.draft && <span className="chip bg-saffron-50 text-saffron-600">Draft phrase</span>}
        </div>

        {prefs.showKannada && (
          <p className="kannada text-3xl text-ink-500 leading-tight">{phrase.kannada}</p>
        )}
        {prefs.showTranslit && <p className="text-lg text-ink-400 mt-1">{phrase.translit}</p>}
        <p className="text-sm text-ink-300 mt-1">{phrase.english}</p>

        <div className="mt-4">
          <SpeakButton text={phrase.kannada} label="Listen first" />
        </div>
      </div>

      {/* Recorder */}
      <div className="card p-5">
        {!micOk ? (
          <div className="flex items-start gap-3 text-terracotta-500">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              Your browser doesn't allow microphone access here. You can still listen and read the phrase. Self-recording is off.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="btn-primary"
                  aria-label={`Start recording yourself saying ${phrase.kannada}`}
                >
                  <Mic className="w-5 h-5" /> Record
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="btn-primary bg-terracotta-500 hover:bg-terracotta-500 active:bg-terracotta-500"
                  aria-label="Stop recording"
                >
                  <Square className="w-5 h-5" /> Stop
                </button>
              )}

              {recording && (
                <span className="flex items-center gap-1.5 text-terracotta-500 text-sm" aria-live="polite">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-pulse" /> Recording…
                </span>
              )}

              {audioUrl && (
                <button type="button" onClick={reset} className="btn-ghost" aria-label="Discard recording and re-record">
                  <RefreshCw className="w-4 h-4" /> Redo
                </button>
              )}
            </div>

            {audioUrl && (
              <div className="mt-4 animate-fade-in">
                <p className="text-sm text-ink-400 mb-2">Playback:</p>
                <audio src={audioUrl} controls className="w-full" />
                <div className="mt-4">
                  <p className="text-sm text-ink-400 mb-1">How did it sound to you?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setState((s) => recordSelfRating(s, phrase.id, n))}
                        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                        className="star-btn"
                      >
                        <Star
                          className={`w-8 h-8 ${n <= (state.selfRatings[phrase.id] ?? 0) ? 'text-saffron-400 fill-saffron-400' : 'text-neutraltint-300'}`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                  {rating !== undefined && (
                    <p className="text-xs text-ink-300 mt-1">
                      Saved as {rating} {rating === 1 ? 'star' : 'stars'}.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Phrase navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => { setIdx((i) => Math.max(0, i - 1)); reset(); }}
          disabled={idx === 0}
          className="btn-ghost disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => { setIdx((i) => Math.min(situation.phrases.length - 1, i + 1)); reset(); }}
          disabled={idx === situation.phrases.length - 1}
          className="btn-ghost disabled:opacity-40"
        >
          Next phrase
        </button>
      </div>

      <div className="card p-4 bg-neutraltint-50 border-neutraltint-200">
        <p className="text-xs text-ink-400 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-ink-300" />
          Speech-to-text feedback is a planned feature, off by default, and its accuracy on learner speech is untested. We won't claim pronunciation scoring until it's built and tested.
        </p>
      </div>
    </div>
  );
}
