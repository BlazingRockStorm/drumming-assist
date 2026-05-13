import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { TIME_SIGNATURES, type TimeSignature } from './constants';

type Props = {
  value: TimeSignature;
  onChange: (value: TimeSignature) => void;
};

export function TimeSignaturePicker({ value, onChange }: Props) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionLabel}>Time Signature</ThemedText>
      <View style={styles.tsGrid}>
        {[TIME_SIGNATURES.slice(0, 4), TIME_SIGNATURES.slice(4, 8)].map((row, ri) => (
          <View key={ri} style={styles.tsRow}>
            {row.map((ts) => {
              const active = ts === value;
              return (
                <Pressable
                  key={ts}
                  onPress={() => onChange(ts)}
                  style={[styles.tsChip, active && styles.tsChipActive]}>
                  <ThemedText
                    style={[styles.tsChipLabel, active && styles.tsChipLabelActive]}>
                    {ts}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 7 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: Palette.textSecondary },
  tsGrid: { gap: 5 },
  tsRow: { flexDirection: 'row', gap: 5 },
  tsChip: {
    flex: 1,
    height: 36,
    borderRadius: 7,
    backgroundColor: Palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tsChipActive: { backgroundColor: Palette.accent },
  tsChipLabel: { fontSize: 13, fontWeight: '600', color: Palette.textPrimary },
  tsChipLabelActive: { color: Palette.bgPrimary },
});
