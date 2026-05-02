import { Image, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

// Replace this PNG with your final drum artwork. Recommended ~600×600, transparent bg.
const DRUM_IMAGE = require('../assets/images/drum.png');

export function AppSplash() {
  return (
    <View style={styles.root}>
      <View style={styles.glow} pointerEvents="none" />
      <View style={styles.center}>
        <Image source={DRUM_IMAGE} style={styles.drum} resizeMode="contain" />
        <ThemedText style={styles.title}>DrumTune</ThemedText>
        <ThemedText style={styles.tagline}>Perfect Pitch, Every Beat</ThemedText>
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
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Palette.accentSoft,
    opacity: 0.25,
  },
  center: {
    alignItems: 'center',
    gap: 22,
  },
  drum: {
    width: 260,
    height: 220,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Palette.textPrimary,
  },
  tagline: {
    fontSize: 15,
    color: Palette.textSecondary,
  },
});
