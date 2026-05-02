import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

type Ring = {
  label: string;
  color: string;
  size: number;
  x: number;
  y: number;
  thickness?: number;
  opacity?: number;
};

const RINGS: Ring[] = [
  { label: '10"', color: Palette.tom10, size: 38, x: 0.42, y: 0.05 },
  { label: '12"', color: Palette.tom12, size: 42, x: 0.55, y: 0.06 },
  { label: '13"', color: Palette.tom13, size: 46, x: 0.68, y: 0.1 },
  { label: 'SN', color: Palette.snare, size: 44, x: 0.27, y: 0.19 },
  { label: 'BD', color: Palette.bass, size: 80, x: 0.42, y: 0.25, thickness: 3, opacity: 0.7 },
  { label: '14"', color: Palette.floor14, size: 52, x: 0.21, y: 0.53, opacity: 0.7 },
  { label: '16"', color: Palette.floor16, size: 58, x: 0.72, y: 0.5, opacity: 0.7 },
];

export function KitVisualization() {
  return (
    <View style={styles.card}>
      <View style={styles.glow} pointerEvents="none" />
      {RINGS.map((r) => (
        <View
          key={r.label}
          style={[
            styles.ring,
            {
              width: r.size,
              height: r.size,
              borderRadius: r.size / 2,
              borderColor: r.color,
              borderWidth: r.thickness ?? 2,
              opacity: r.opacity ?? 0.8,
              left: `${r.x * 100}%`,
              top: `${r.y * 100}%`,
            },
          ]}>
          <ThemedText
            style={[
              styles.ringLabel,
              { color: r.color, fontSize: r.label.length > 2 ? 11 : 9 },
            ]}>
            {r.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: 16,
    backgroundColor: Palette.bgSurface,
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Palette.accentSoft,
    opacity: 0.4,
    left: '30%',
    top: '-20%',
  },
  ring: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontWeight: '700',
  },
});
