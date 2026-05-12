import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

const GLOW_LAYERS = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  const size = 30 + Math.pow(t, 1.1) * 250;
  return { size, opacity: 0.022 };
});

export function GlowBackground() {
  return (
    <View style={styles.glowContainer} pointerEvents="none">
      {GLOW_LAYERS.map(({ size, opacity }, i) => (
        <View
          key={i}
          style={[
            styles.glowLayer,
            { width: size, height: size, borderRadius: size / 2, opacity },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowLayer: {
    position: 'absolute',
    backgroundColor: Palette.accent,
  },
});
