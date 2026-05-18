import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KitVisualization } from '@/components/kit-visualization';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';
import { DRUMS, type Drum, type DrumNote } from '@/constants/drums';

const TAB_BAR_SPACE = 100;

export default function KitScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 22,
            paddingBottom: insets.bottom + TAB_BAR_SPACE,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.title}>My Drum Kit</ThemedText>
            <ThemedText style={styles.subtitle}>Standard Rock Tuning</ThemedText>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Feather name="settings" size={18} color={Palette.textSecondary} />
          </TouchableOpacity>
        </View>

        <KitVisualization />

        <View style={styles.listHeader}>
          <ThemedText style={styles.listTitle}>Drums</ThemedText>
          <ThemedText style={styles.listCount}>{DRUMS.length} drums</ThemedText>
        </View>

        <View style={styles.list}>
          {DRUMS.map((drum) => (
            <DrumCard key={drum.id} drum={drum} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function DrumCard({ drum }: { drum: Drum }) {
  const sizeLabel = drum.depth ? `${drum.size} × ${drum.depth}` : drum.size;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/drum/${drum.id}` as never)}
      activeOpacity={0.75}>
      <View style={[styles.colorBar, { backgroundColor: drum.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <ThemedText style={styles.drumName}>{drum.name}</ThemedText>
          <ThemedText style={styles.drumSize}>{sizeLabel}</ThemedText>
        </View>
        <View style={styles.cardBottomRow}>
          <NoteLine direction="batter" note={drum.batter.target} color={drum.color} />
          {drum.resonant && (
            <NoteLine direction="reso" note={drum.resonant.target} color={drum.color} />
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
    </TouchableOpacity>
  );
}

function NoteLine({
  direction,
  note,
  color,
}: {
  direction: 'batter' | 'reso';
  note: DrumNote;
  color: string;
}) {
  return (
    <View style={styles.noteLine}>
      <Text style={[styles.noteMark, { color }]}>{direction === 'batter' ? '▲' : '▼'}</Text>
      <ThemedText style={styles.noteLabel}>{direction === 'batter' ? 'Batter' : 'Reso'}</ThemedText>
      <ThemedText style={styles.noteValue}>
        {note.note} · {note.frequency} Hz
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { gap: 2, flex: 1 },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 13,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  listCount: {
    fontSize: 13,
    color: Palette.textTertiary,
  },
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Palette.bgSurface,
    borderRadius: 14,
    padding: 16,
  },
  colorBar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  cardBody: { flex: 1, gap: 6 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  drumName: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textPrimary,
    flexShrink: 1,
  },
  drumSize: {
    fontSize: 12,
    color: Palette.textTertiary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  noteLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteMark: {
    fontSize: 8,
    fontWeight: '700',
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textTertiary,
  },
  noteValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
});
