import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { SUBDIVISIONS, SUB_ICONS, type Subdivision } from './constants';

type Props = {
  value: Subdivision;
  onChange: (value: Subdivision) => void;
};

export function SubdivisionPicker({ value, onChange }: Props) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionLabel}>Subdivision</ThemedText>
      <View style={styles.subRow}>
        {SUBDIVISIONS.map((s) => {
          const active = s === value;
          return (
            <Pressable
              key={s}
              onPress={() => onChange(s)}
              style={[styles.subChip, active && styles.subChipActive]}>
              <Image
                source={SUB_ICONS[s]}
                style={styles.subIcon}
                tintColor={active ? Palette.bgPrimary : Palette.textPrimary}
                contentFit="contain"
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 7 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: Palette.textSecondary },
  subRow: { flexDirection: 'row', gap: 5 },
  subChip: {
    flex: 1,
    height: 47,
    borderRadius: 7,
    backgroundColor: Palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subChipActive: { backgroundColor: Palette.accent },
  subIcon: { width: 44, height: 30 },
});
