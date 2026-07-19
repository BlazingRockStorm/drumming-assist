import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { type ThemePalette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { tempoLabel } from './constants';

type Props = {
  bpm: number;
  onAdjust: (delta: number) => void;
};

export function BpmControl({ bpm, onAdjust }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.bpmRow}>
      <Pressable style={styles.stepBtn} onPress={() => onAdjust(-1)} accessibilityRole="button">
        <ThemedText style={styles.stepLabel}>−</ThemedText>
      </Pressable>

      <View style={styles.bpmCircle}>
        <View style={styles.bpmRing} />
        <View style={styles.bpmInner} />
        <View style={styles.bpmDisplay}>
          <ThemedText style={styles.tempoLabel}>{tempoLabel(bpm)}</ThemedText>
          <ThemedText style={styles.bpmValue}>{bpm}</ThemedText>
          <ThemedText style={styles.bpmUnit}>B P M</ThemedText>
        </View>
      </View>

      <Pressable style={styles.stepBtn} onPress={() => onAdjust(1)} accessibilityRole="button">
        <ThemedText style={styles.stepLabel}>+</ThemedText>
      </Pressable>
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 11,
  },
  stepBtn: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: palette.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { fontSize: 23, color: palette.textPrimary, lineHeight: 25 },
  bpmCircle: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 20,
    borderColor: palette.accent,
  },
  bpmInner: {
    position: 'absolute',
    width: 139,
    height: 139,
    borderRadius: 70,
    backgroundColor: palette.bgElevated,
  },
  bpmDisplay: { alignItems: 'center', gap: 2 },
  tempoLabel: { fontSize: 11, color: palette.textSecondary, letterSpacing: 0.5, fontWeight: '300' },
  bpmValue: { fontSize: 47, fontWeight: '700', color: palette.textPrimary, lineHeight: 50 },
  bpmUnit: { fontSize: 9, color: palette.textTertiary, letterSpacing: 2 },
});
