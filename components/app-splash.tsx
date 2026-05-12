import { Image, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { GlowBackground } from '@/components/ui/glow-background';

// Replace this PNG with your final drum artwork. Recommended ~600×600, transparent bg.
const DRUM_IMAGE = require('../assets/images/splash-icon.png');

export function AppSplash() {
  return (
    <View style={styles.root}>
      <GlowBackground />
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
