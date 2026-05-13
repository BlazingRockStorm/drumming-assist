import { useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { SUBDIVISION_TICKS, type Subdivision } from './constants';

export function useMetronomeEngine(
  bpm: number,
  beatsPerMeasure: number,
  subdivision: Subdivision,
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);

  const beatCountRef = useRef(beatsPerMeasure);
  beatCountRef.current = beatsPerMeasure;
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const ticksPerBeatRef = useRef(SUBDIVISION_TICKS[subdivision]);
  ticksPerBeatRef.current = SUBDIVISION_TICKS[subdivision];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cowbellHigh = useAudioPlayer(require('@/assets/sounds/cowbell-high.wav'));
  const cowbellMid = useAudioPlayer(require('@/assets/sounds/cowbell-mid.wav'));
  const cowbellLow = useAudioPlayer(require('@/assets/sounds/cowbell-low.wav'));

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const cowbellHighRef = useRef(cowbellHigh);
  cowbellHighRef.current = cowbellHigh;
  const cowbellMidRef = useRef(cowbellMid);
  cowbellMidRef.current = cowbellMid;
  const cowbellLowRef = useRef(cowbellLow);
  cowbellLowRef.current = cowbellLow;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!isPlaying) {
      setActiveBeat(0);
      return;
    }
    const playTick = (beat: number, sub: number) => {
      let player;
      if (sub !== 0) player = cowbellLowRef.current;
      else if (beat === 0) player = cowbellHighRef.current;
      else player = cowbellMidRef.current;
      if (!player) return;
      player.seekTo(0);
      player.play();
    };
    let beat = 0;
    let sub = 0;
    setActiveBeat(0);
    playTick(0, 0);
    intervalRef.current = setInterval(() => {
      sub += 1;
      if (sub >= ticksPerBeatRef.current) {
        sub = 0;
        beat = (beat + 1) % beatCountRef.current;
        setActiveBeat(beat);
      }
      playTick(beat, sub);
    }, ((60 / bpmRef.current) * 1000) / ticksPerBeatRef.current);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, subdivision]);

  return { isPlaying, setIsPlaying, activeBeat };
}
