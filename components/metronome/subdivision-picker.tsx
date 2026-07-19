import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { type ThemePalette } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { SUBDIVISIONS, SUB_ICONS, type Subdivision } from './constants';

type Props = {
  value: Subdivision;
  onChange: (value: Subdivision) => void;
};

export function SubdivisionPicker({ value, onChange }: Props) {
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);
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
                tintColor={active ? palette.bgPrimary : palette.textPrimary}
                contentFit="contain"
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
  section: { gap: 7 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: palette.textSecondary },
  subRow: { flexDirection: 'row', gap: 5 },
  subChip: {
    flex: 1,
    height: 47,
    borderRadius: 7,
    backgroundColor: palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subChipActive: { backgroundColor: palette.accent },
  subIcon: { width: 44, height: 30 },
});
