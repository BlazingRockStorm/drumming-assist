import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';
import { DRUMS, type DrumHeadTuning } from '@/constants/drums';

export default function DrumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const drum = DRUMS.find((d) => d.id === id);
  const insets = useSafeAreaInsets();

  if (!drum) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Drum not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: drum.name,
          headerBackTitle: 'Back',
          headerTintColor: drum.color,
          headerStyle: { backgroundColor: Palette.bgPrimary },
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: drum.color + '18' }]}>
          <View style={[styles.drumCircle, { backgroundColor: drum.color }]}>
            <ThemedText style={styles.circleSize}>{drum.size}</ThemedText>
          </View>
          <View style={styles.heroText}>
            <ThemedText style={[styles.heroTitle, { color: drum.color }]}>{drum.name}</ThemedText>
            <ThemedText style={styles.heroDesc}>{drum.description}</ThemedText>
          </View>
        </View>

        <HeadCard title="Batter Head" tuning={drum.batter} color={drum.color} />

        {drum.resonant && (
          <HeadCard title="Resonant Head" tuning={drum.resonant} color={drum.color} />
        )}

        <View style={styles.tipsCard}>
          <ThemedText style={styles.cardLabel}>Tuning Tips</ThemedText>
          {drum.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: drum.color }]} />
              <ThemedText style={styles.tipText}>{tip}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

function HeadCard({
  title,
  tuning,
  color,
}: {
  title: string;
  tuning: DrumHeadTuning;
  color: string;
}) {
  return (
    <View style={styles.headCard}>
      <ThemedText style={styles.cardLabel}>{title}</ThemedText>
      <View style={styles.headRow}>
        <View
          style={[
            styles.targetBox,
            { backgroundColor: color + '18', borderColor: color + '50' },
          ]}>
          <ThemedText style={styles.targetLabel}>Target</ThemedText>
          <ThemedText style={[styles.targetNote, { color }]}>{tuning.target.note}</ThemedText>
          <ThemedText style={styles.targetHz}>{tuning.target.frequency} Hz</ThemedText>
        </View>

        <View style={styles.rangeBox}>
          <View style={styles.rangeBound}>
            <ThemedText style={styles.rangeDir}>Low</ThemedText>
            <ThemedText style={styles.rangeNote}>{tuning.low.note}</ThemedText>
            <ThemedText style={styles.rangeHz}>{tuning.low.frequency} Hz</ThemedText>
          </View>
          <View style={styles.rangeTrack}>
            <View style={[styles.rangeTrackFill, { backgroundColor: color + '35' }]} />
            <View style={[styles.rangeMarker, { backgroundColor: color }]} />
          </View>
          <View style={styles.rangeBound}>
            <ThemedText style={styles.rangeDir}>High</ThemedText>
            <ThemedText style={styles.rangeNote}>{tuning.high.note}</ThemedText>
            <ThemedText style={styles.rangeHz}>{tuning.high.frequency} Hz</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgPrimary,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 16,
    padding: 20,
  },
  drumCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  circleSize: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textSecondary,
  },
  headCard: {
    borderRadius: 14,
    padding: 16,
    gap: 14,
    backgroundColor: Palette.bgSurface,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Palette.textTertiary,
    marginBottom: 2,
  },
  headRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  targetBox: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minWidth: 96,
    borderWidth: 1,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Palette.textSecondary,
    marginBottom: 2,
  },
  targetNote: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  targetHz: {
    fontSize: 12,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  rangeBox: {
    flex: 1,
    gap: 6,
  },
  rangeBound: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rangeDir: {
    fontSize: 11,
    color: Palette.textTertiary,
    width: 30,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rangeNote: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    width: 38,
  },
  rangeHz: {
    fontSize: 12,
    color: Palette.textTertiary,
  },
  rangeTrack: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
    marginVertical: 2,
    backgroundColor: Palette.bgCard,
  },
  rangeTrackFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  rangeMarker: {
    position: 'absolute',
    left: '50%',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: -2,
    marginLeft: -5,
  },
  tipsCard: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: Palette.bgSurface,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  tipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 7,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textSecondary,
  },
});
