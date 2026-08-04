import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DrumColors, type ThemePalette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

const VIZ_WIDTH = 353;
const VIZ_HEIGHT = 226;

type Ring = {
  id: string;
  label: string;
  color: string;
  size: number;
  x: number;
  y: number;
  thickness?: number;
  opacity?: number;
};

const BASS = {
  id: 'bass-drum',
  label: 'BD',
  color: DrumColors.bass,
  width: 82,
  height: 67,
  x: 131,
  y: 42,
  thickness: 3,
  opacity: 0.85,
  cornerRadius: 6,
};

const RINGS: Ring[] = [
  { id: 'rack-tom-12', label: '12"', color: DrumColors.tom12, size: 45, x: 122, y: 26 },
  { id: 'rack-tom-13', label: '13"', color: DrumColors.tom13, size: 48, x: 177, y: 24 },
  { id: 'rack-tom-10', label: '10"', color: DrumColors.tom10, size: 37, x: 84, y: 56 },
  { id: 'snare', label: 'SN', color: DrumColors.snare, size: 52, x: 110, y: 111, thickness: 2.5 },
  { id: 'floor-tom', label: '14"', color: DrumColors.floor14, size: 52, x: 193, y: 107 },
  { id: 'floor-tom-16', label: '16"', color: DrumColors.floor16, size: 59, x: 222, y: 155 },
];

/**
 * Renders the kit layout. Pass `visible` (a set of piece ids) to show only
 * those pieces; omit it to show the full kit.
 */
export function KitVisualization({ visible }: { visible?: Set<string> } = {}) {
  const styles = useThemedStyles(createStyles);
  const showBass = !visible || visible.has(BASS.id);
  const rings = visible ? RINGS.filter((r) => visible.has(r.id)) : RINGS;
  return (
    <View style={styles.card}>
      {showBass && (
        <View
          style={[
            styles.shape,
            {
              width: BASS.width,
              height: BASS.height,
              borderRadius: BASS.cornerRadius,
              borderColor: BASS.color,
              borderWidth: BASS.thickness,
              opacity: BASS.opacity,
              left: `${(BASS.x / VIZ_WIDTH) * 100}%`,
              top: BASS.y,
            },
          ]}>
          <ThemedText style={[styles.label, { color: BASS.color, fontSize: 11 }]}>
            {BASS.label}
          </ThemedText>
        </View>
      )}
      {rings.map((r) => (
        <View
          key={r.label}
          style={[
            styles.shape,
            {
              width: r.size,
              height: r.size,
              borderRadius: r.size / 2,
              borderColor: r.color,
              borderWidth: r.thickness ?? 2,
              backgroundColor: '#fff',
              left: `${(r.x / VIZ_WIDTH) * 100}%`,
              top: r.y,
            },
          ]}>
          <ThemedText
            style={[styles.label, { color: r.color, fontSize: r.label.length > 2 ? 10 : 9 }]}>
            {r.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
  card: {
    height: VIZ_HEIGHT,
    borderRadius: 16,
    backgroundColor: palette.bgSurface,
    overflow: 'hidden',
    position: 'relative',
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
  },
});
