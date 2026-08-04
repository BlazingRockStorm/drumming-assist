import { AudioModule } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tuning verdict for a struck drum relative to the selected target note.
 * - `flat`  → pitch is below target; the head is too loose → tighten.
 * - `sharp` → pitch is above target; the head is too tight → loosen.
 */
export type TunerStatus = 'idle' | 'listening' | 'flat' | 'in-tune' | 'sharp';

// Plausible fundamental range for any drumhead in the kit (bass reso ~55 Hz
// up to snare reso highs ~392 Hz). Anything outside is noise / a stray harmonic.
const MIN_HZ = 30;
const MAX_HZ = 600;

// Within this many cents of the target counts as in tune. Drums are
// inharmonic, so this is looser than a guitar tuner's ~5 cents.
const IN_TUNE_CENTS = 30;

// Number of recent valid readings to median-smooth before judging, so a
// single noisy strike transient doesn't flip the verdict.
const SMOOTH_WINDOW = 5;

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

/** Nearest 12-TET note name (A4 = 440 Hz), e.g. 294 → "D4". */
export function noteNameFromHz(hz: number): string {
  if (hz <= 0) return '—';
  const semisFromA4 = Math.round(12 * Math.log2(hz / 440));
  const midi = semisFromA4 + 69;
  return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/**
 * Fold a detected frequency into the octave nearest the target. Drum pitch
 * detection frequently locks onto an overtone an octave (or two) off; folding
 * makes the comparison robust to that without hiding real flat/sharp error.
 */
function foldToTarget(freq: number, target: number): number {
  if (freq <= 0 || target <= 0) return freq;
  let f = freq;
  while (f / target > 1.5) f /= 2;
  while (target / f > 1.5) f *= 2;
  return f;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export interface DrumTuner {
  status: TunerStatus;
  isListening: boolean;
  /** Smoothed detected fundamental, in Hz (null until a stable reading). */
  frequency: number | null;
  /** Signed cents from target (negative = flat, positive = sharp). */
  cents: number | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  /**
   * Discard buffered readings without leaving the mic. Call when the thing
   * being measured changes (a different lug, the other head) so the previous
   * strike's samples can't leak into the next verdict.
   */
  reset: () => void;
  /** Raw pitch readings from the sensor are pushed through here. */
  feed: (hz: number) => void;
  /** The sensor reports failures (mic denied inside the WebView) here. */
  fail: (message: string) => void;
}

/**
 * Judges raw pitch readings (from the PitchSensor DOM component) against
 * `targetHz`. The target can change while listening (e.g. the user switches
 * head or pitch) — the latest value is always used. `start` only requests the
 * app-level mic permission; the caller mounts the sensor while `isListening`.
 */
export function useDrumTuner(targetHz: number): DrumTuner {
  const [status, setStatus] = useState<TunerStatus>('idle');
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [cents, setCents] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const targetRef = useRef(targetHz);
  const samplesRef = useRef<number[]>([]);
  const prevStatusRef = useRef<TunerStatus>('idle');
  const listeningRef = useRef(false);

  useEffect(() => {
    targetRef.current = targetHz;
  }, [targetHz]);

  const stop = useCallback(() => {
    samplesRef.current = [];
    prevStatusRef.current = 'idle';
    listeningRef.current = false;
    setIsListening(false);
    setStatus('idle');
    setFrequency(null);
    setCents(null);
  }, []);

  const reset = useCallback(() => {
    samplesRef.current = [];
    const base: TunerStatus = listeningRef.current ? 'listening' : 'idle';
    prevStatusRef.current = base;
    setStatus(base);
    setFrequency(null);
    setCents(null);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone access denied. Enable it in Settings and try again.');
        return;
      }
    } catch {
      setError('Could not request microphone access.');
      return;
    }
    samplesRef.current = [];
    prevStatusRef.current = 'listening';
    listeningRef.current = true;
    setIsListening(true);
    setStatus('listening');
  }, []);

  const feed = useCallback((raw: number) => {
    if (!raw || raw < MIN_HZ || raw > MAX_HZ) return;

    const buf = samplesRef.current;
    buf.push(raw);
    if (buf.length > SMOOTH_WINDOW) buf.shift();
    if (buf.length < SMOOTH_WINDOW) return;

    const smoothed = median(buf);
    const target = targetRef.current;
    const folded = foldToTarget(smoothed, target);
    const off = 1200 * Math.log2(folded / target);

    let next: TunerStatus;
    if (Math.abs(off) <= IN_TUNE_CENTS) next = 'in-tune';
    else if (off < 0) next = 'flat';
    else next = 'sharp';

    setFrequency(smoothed);
    setCents(off);
    setStatus(next);

    if (next === 'in-tune' && prevStatusRef.current !== 'in-tune') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevStatusRef.current = next;
  }, []);

  const fail = useCallback(
    (message: string) => {
      stop();
      setError(
        message === 'mic-unavailable'
          ? 'Microphone unavailable. Enable mic access in Settings and try again.'
          : message
      );
    },
    [stop]
  );

  return { status, isListening, frequency, cents, error, start, stop, reset, feed, fail };
}
