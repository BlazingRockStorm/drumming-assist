import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  beats: number;
  activeBeat: number;
  isPlaying: boolean;
};

export function BeatIndicator({ beats, activeBeat, isPlaying }: Props) {
  const dots = useMemo(() => Array.from({ length: beats }), [beats]);
  return (
    <View style={styles.beats}>
      {dots.map((_, i) => (
        <View
          key={i}
          style={[
            styles.beatDot,
            (isPlaying ? i === activeBeat : i === 0) && styles.beatDotActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  beats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    height: 29,
  },
  beatDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: Palette.bgElevated,
  },
  beatDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Palette.accent,
  },
});
