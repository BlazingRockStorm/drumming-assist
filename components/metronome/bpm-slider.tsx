import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { BPM_MAX, BPM_MIN } from './constants';
import { useBpmDrag } from './use-bpm-drag';

type Props = {
  bpm: number;
  onChange: (value: number) => void;
};

export function BpmSlider({ bpm, onChange }: Props) {
  const { panHandlers, onTrackLayout } = useBpmDrag(bpm, onChange);
  const sliderPct = ((bpm - BPM_MIN) / (BPM_MAX - BPM_MIN)) * 100;

  return (
    <View style={styles.slider}>
      <View
        style={styles.sliderTouchArea}
        onLayout={(e) => onTrackLayout(e.nativeEvent.layout.width)}
        {...panHandlers}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${sliderPct}%` }]} />
          <View style={[styles.sliderThumb, { left: `${sliderPct}%` }]} />
        </View>
      </View>
      <View style={styles.sliderLabels}>
        <ThemedText style={styles.sliderLabel}>{BPM_MIN} BPM</ThemedText>
        <ThemedText style={styles.sliderLabel}>{BPM_MAX} BPM</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: { gap: 9 },
  sliderTouchArea: {
    paddingVertical: 11,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.bgElevated,
    position: 'relative',
  },
  sliderFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.accent,
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.accent,
    marginLeft: -8,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { fontSize: 10, color: Palette.textTertiary },
});
