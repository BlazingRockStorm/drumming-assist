'use dom';

import { useEffect, useRef } from 'react';
import type { DOMProps } from 'expo/dom';

const FFT_SIZE = 4096;
const REPORT_MS = 100;
// Below this RMS the buffer is treated as silence, not a drum hit.
const MIN_RMS = 0.012;

/**
 * Autocorrelation pitch detection (ACF2+ variant): trims low-amplitude edges,
 * finds the first correlation peak after the initial dip, then refines it
 * with parabolic interpolation. Returns -1 when no confident pitch is found.
 */
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < MIN_RMS) return -1;

  const threshold = 0.2;
  let r1 = 0;
  let r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buf.slice(r1, r2);
  const N = trimmed.length;
  if (N < 2) return -1;

  const c = new Float32Array(N);
  for (let lag = 0; lag < N; lag++) {
    let sum = 0;
    for (let i = 0; i < N - lag; i++) sum += trimmed[i] * trimmed[i + lag];
    c[lag] = sum;
  }

  let d = 0;
  while (d < N - 1 && c[d] > c[d + 1]) d++;
  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < N; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }
  if (maxPos <= 0) return -1;

  let T0 = maxPos;
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1] ?? x2;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

/**
 * Invisible DOM component that opens the microphone via Web Audio and streams
 * detected fundamentals to the native side. Mounting starts the mic; unmounting
 * releases it. Runs inside a WebView, so no native audio module is needed.
 */
export default function PitchSensor({
  onPitch,
  onError,
}: {
  onPitch: (hz: number) => Promise<void>;
  onError: (message: string) => Promise<void>;
  dom?: DOMProps;
}) {
  const onPitchRef = useRef(onPitch);
  const onErrorRef = useRef(onError);
  onPitchRef.current = onPitch;
  onErrorRef.current = onError;

  useEffect(() => {
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        ctx = new AudioContext();
        await ctx.resume();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        source.connect(analyser);

        const buf = new Float32Array(analyser.fftSize);
        timer = setInterval(() => {
          analyser.getFloatTimeDomainData(buf);
          const hz = autoCorrelate(buf, ctx!.sampleRate);
          if (hz > 0) onPitchRef.current(hz);
        }, REPORT_MS);
      } catch {
        onErrorRef.current('mic-unavailable');
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});
    };
  }, []);

  return null;
}
