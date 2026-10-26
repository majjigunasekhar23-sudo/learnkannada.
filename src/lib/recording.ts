/**
 * Microphone recording using MediaRecorder. Returns a blob URL for playback.
 * This is self-recording + self-rating only — no speech recognition or
 * pronunciation scoring is claimed.
 */

export function micSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia
  );
}

export interface Recorder {
  start: () => Promise<void>;
  stop: () => Promise<string | null>;
  isRecording: () => boolean;
}

export function createRecorder(): Recorder {
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let recording = false;
  let stream: MediaStream | null = null;

  return {
    async start() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      // Prefer a widely-supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.start();
      recording = true;
    },
    stop() {
      return new Promise<string | null>((resolve) => {
        if (!mediaRecorder) return resolve(null);
        mediaRecorder.onstop = () => {
          recording = false;
          stream?.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
          resolve(URL.createObjectURL(blob));
        };
        mediaRecorder.stop();
      });
    },
    isRecording() {
      return recording;
    },
  };
}
