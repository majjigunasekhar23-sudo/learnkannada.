/**
 * Speech synthesis helper for Kannada ("kn-IN").
 * Falls back gracefully when no Kannada voice is available, and supports
 * optional local audio files as a substitute for synthesized speech.
 */

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function kannadaVoiceAvailable(): boolean {
  if (!speechSupported()) return false;
  if (cachedVoice === undefined) cachedVoice = findKannadaVoice();
  return cachedVoice !== null;
}

function findKannadaVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const kn = voices.find((v) => v.lang?.toLowerCase().startsWith('kn'));
  return kn ?? null;
}

export function primeVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (!speechSupported()) return resolve();
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      cachedVoice = findKannadaVoice();
      return resolve();
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      cachedVoice = findKannadaVoice();
      resolve();
    };
    window.speechSynthesis.onvoiceschanged = done;
    // Fallback in case the event never fires
    setTimeout(done, 800);
  });
}

export interface SpeakHandle {
  cancel: () => void;
}

export function speak(
  text: string,
  onstart?: () => void,
  onend?: () => void,
  onerror?: () => void,
): SpeakHandle {
  if (!speechSupported()) {
    onerror?.();
    return { cancel: () => {} };
  }
  // Always cancel anything in flight so rapid taps don't queue
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'kn-IN';
  if (cachedVoice === undefined) cachedVoice = findKannadaVoice();
  if (cachedVoice) u.voice = cachedVoice;
  u.rate = 0.85;
  u.pitch = 1;

  if (onstart) u.onstart = onstart;
  if (onend) u.onend = onend;
  if (onerror) u.onerror = onerror;

  window.speechSynthesis.speak(u);

  return {
    cancel: () => {
      window.speechSynthesis.cancel();
    },
  };
}
