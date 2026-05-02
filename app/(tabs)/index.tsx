import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KitVisualization } from '@/components/kit-visualization';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';
import { DRUMS, type Drum } from '@/constants/drums';

const TAB_BAR_SPACE = 100;

export default function KitScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + TAB_BAR_SPACE,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText type="title">My Drum Kit</ThemedText>
            <ThemedText style={styles.subtitle}>Standard Rock Tuning</ThemedText>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Feather name="settings" size={20} color={Palette.textSecondary} />
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
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/drum/${drum.id}` as never)}
      activeOpacity={0.75}>
      <View style={[styles.colorBar, { backgroundColor: drum.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <ThemedText style={styles.drumName}>{drum.name}</ThemedText>
          <ThemedText style={styles.drumSize}>{drum.size}</ThemedText>
        </View>
        <View style={styles.cardBottomRow}>
          <NoteLine
            label="Batter"
            note={drum.batter.target.note}
            hz={drum.batter.target.frequency}
            color={drum.color}
          />
          {drum.resonant && (
            <NoteLine
              label="Reso"
              note={drum.resonant.target.note}
              hz={drum.resonant.target.frequency}
              color={drum.color}
            />
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
    </TouchableOpacity>
  );
}

function NoteLine({
  label,
  note,
  hz,
  color,
}: {
  label: string;
  note: string;
  hz: number;
  color: string;
}) {
  return (
    <View style={styles.noteLine}>
      <Feather name="play" size={9} color={color} style={styles.noteIcon} />
      <ThemedText style={styles.noteLabel}>{label}</ThemedText>
      <ThemedText style={styles.noteValue}>{note}</ThemedText>
      <ThemedText style={styles.noteHz}>· {hz} Hz</ThemedText>
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
  headerLeft: { gap: 4, flex: 1 },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 18,
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
  cardBody: { flex: 1, gap: 8 },
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
    gap: 14,
  },
  noteLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteIcon: { marginRight: 2 },
  noteLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  noteValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  noteHz: {
    fontSize: 12,
    color: Palette.textTertiary,
  },
});
