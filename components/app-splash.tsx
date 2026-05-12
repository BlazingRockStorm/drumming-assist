import { Image, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

// Replace this PNG with your final drum artwork. Recommended ~600×600, transparent bg.
const DRUM_IMAGE = require('../assets/images/splash-icon.png');

const GLOW_LAYERS = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  const size = 30 + Math.pow(t, 1.1) * 250;
  return { size, opacity: 0.022 };
});

export function AppSplash() {
  return (
    <View style={styles.root}>
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
      <View style={styles.center}>
        <View style={styles.drumWrap}>
          <Image source={DRUM_IMAGE} style={styles.drum} resizeMode="contain" />
        </View>
        <View style={styles.textWrap}>
          <ThemedText style={styles.title}>Drumming Assist</ThemedText>
          <ThemedText style={styles.tagline}>Perfect Pitch, Every Beat</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
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
  center: {
    alignItems: 'center',
    gap: 20,
  },
  drumWrap: {
    width: 292,
    height: 200,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drum: {
    width: 380,
    height: 350,
    transform: [{ translateX: 5 }],
  },
  textWrap: {
    alignItems: 'center',
    gap: 8,
    includeFontPadding: false,
  },
  title: {
    fontSize: 34,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Palette.textPrimary,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
    color: Palette.textSecondary,
  },
});
