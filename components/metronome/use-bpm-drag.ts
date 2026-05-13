import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { BPM_MAX, BPM_MIN } from './constants';

export function useBpmDrag(bpm: number, setBpm: (value: number) => void) {
  const trackWidth = useRef(0);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const initialBpmRef = useRef(bpm);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialBpmRef.current = bpmRef.current;
      },
      onPanResponderMove: (_evt, gestureState) => {
        const deltaPct = gestureState.dx / trackWidth.current;
        const deltaBpm = deltaPct * (BPM_MAX - BPM_MIN);
        setBpm(Math.round(Math.max(BPM_MIN, Math.min(BPM_MAX, initialBpmRef.current + deltaBpm))));
      },
    })
  ).current;

  const onTrackLayout = (width: number) => {
    trackWidth.current = width;
  };

  return { panHandlers: panResponder.panHandlers, onTrackLayout };
}
