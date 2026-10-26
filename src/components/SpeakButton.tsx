import { useEffect, useState } from 'react';
import { Volume2, Loader2, AlertTriangle } from 'lucide-react';
import { kannadaVoiceAvailable, primeVoices, speak, speechSupported } from '@/lib/speech';

interface SpeakButtonProps {
  text: string;
  audioPath?: string; // optional local audio file under /audio
  label?: string;
  className?: string;
}

type Phase = 'idle' | 'speaking' | 'unavailable' | 'loading';

export default function SpeakButton({ text, audioPath, label = 'Listen', className = '' }: SpeakButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [useFallbackAudio, setUseFallbackAudio] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await primeVoices();
      if (!mounted) return;
      const ok = speechSupported() && kannadaVoiceAvailable();
      if (!ok && audioPath) setUseFallbackAudio(true);
      else if (!ok) setPhase('unavailable');
    })();
    return () => {
      mounted = false;
    };
  }, [audioPath]);

  function handleClick() {
    // Priority: local audio file > speech synthesis > graceful message
    if (audioPath && (!speechSupported() || !kannadaVoiceAvailable())) {
      playLocal(audioPath);
      return;
    }
    if (!speechSupported() || !kannadaVoiceAvailable()) {
      setPhase('unavailable');
      return;
    }
    setPhase('speaking');
    speak(
      text,
      () => setPhase('speaking'),
      () => setPhase('idle'),
      () => setPhase('unavailable'),
    );
  }

  function playLocal(path: string) {
    try {
      const audio = new Audio(path);
      setPhase('speaking');
      audio.onended = () => setPhase('idle');
      audio.onerror = () => setPhase('unavailable');
      audio.play().catch(() => setPhase('unavailable'));
    } catch {
      setPhase('unavailable');
    }
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <button
        type="button"
        onClick={handleClick}
        disabled={phase === 'speaking' || phase === 'loading'}
        aria-label={`${label}: ${text}`}
        className={`btn-secondary !py-2 !px-3 text-sm ${className}`}
      >
        {phase === 'speaking' ? (
          <span className="flex items-center gap-1.5 text-brand-600" aria-hidden="true">
            <span className="eq-bar h-3" />
            <span className="eq-bar h-3" />
            <span className="eq-bar h-3" />
            <span className="eq-bar h-3" />
          </span>
        ) : phase === 'unavailable' ? (
          <AlertTriangle className="w-4 h-4 text-terracotta-500" aria-hidden="true" />
        ) : (
          <Volume2 className="w-4 h-4 text-brand-600" aria-hidden="true" />
        )}
        <span>{label}</span>
      </button>
      {phase === 'unavailable' && (
        <p className="text-xs text-terracotta-500 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          Audio unavailable. Add a recorded file at
          <code className="font-mono text-[11px] bg-terracotta-50 px-1 py-0.5 rounded">
            /public/audio/...
          </code>
        </p>
      )}
      {useFallbackAudio && phase !== 'unavailable' && (
        <span className="text-[11px] text-ink-300 mt-0.5">Using a recorded file.</span>
      )}
    </div>
  );
}
