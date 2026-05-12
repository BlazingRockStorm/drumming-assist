import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

const STEP_MS = 60;
const STEP_PCT = 3;
const HOLD_MS = 200;

const GLOW_LAYERS = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  const size = 30 + Math.pow(t, 1.1) * 250;
  return { size, opacity: 0.022 };
});

export function AppLoading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + STEP_PCT));
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onDone, HOLD_MS);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

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
        <View style={styles.loaderRings}>
          <View style={styles.ringOuter} />
          <View style={styles.ringInner} />
          <View style={styles.ringDot} />
        </View>

        <ThemedText style={styles.title}>DrumTune</ThemedText>

        <View style={styles.spacer} />

        <ThemedText style={styles.label}>Setting up your kit...</ThemedText>

        <View style={styles.progressArea}>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${progress}%` }]} />
          </View>
          <ThemedText style={styles.pct}>{progress}%</ThemedText>
        </View>

        <View style={styles.tipSpacer} />

        <ThemedText style={styles.tip}>
          Tip: Start with the batter head{'\n'}for best results
        </ThemedText>
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
    gap: 16,
    width: '100%',
    paddingHorizontal: 32,
  },
  loaderRings: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: Palette.accent,
  },
  ringInner: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: Palette.accent,
    opacity: 0.6,
  },
  ringDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.accent,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Palette.textPrimary,
  },
  spacer: { height: 8 },
  label: {
    fontSize: 14,
    color: Palette.textSecondary,
  },
  progressArea: {
    alignItems: 'center',
    gap: 8,
    width: 260,
  },
  track: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.bgCard,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Palette.accent,
  },
  pct: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
  },
  tipSpacer: { height: 24 },
  tip: {
    fontSize: 12,
    color: Palette.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
