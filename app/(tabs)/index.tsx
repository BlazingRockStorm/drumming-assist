import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DRUMS } from '@/constants/drums';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function KitScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">My Drum Kit</ThemedText>
        <ThemedText style={styles.subtitle}>Tap a drum to see tuning details</ThemedText>
      </ThemedView>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}>
        {DRUMS.map((drum) => (
          <TouchableOpacity
            key={drum.id}
            style={[
              styles.card,
              {
                borderLeftColor: drum.color,
                backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa',
              },
            ]}
            onPress={() => router.push(`/drum/${drum.id}` as never)}
            activeOpacity={0.7}>
            <View style={[styles.colorDot, { backgroundColor: drum.color }]} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.drumName}>{drum.name}</ThemedText>
                <View style={[styles.sizeTag, { backgroundColor: drum.color + '25' }]}>
                  <ThemedText style={[styles.drumSize, { color: drum.color }]}>
                    {drum.size}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.notesRow}>
                <NoteChip
                  label="Batter"
                  note={drum.batter.target.note}
                  hz={drum.batter.target.frequency}
                  color={drum.color}
                />
                {drum.resonant && (
                  <>
                    <ThemedText style={styles.arrow}>→</ThemedText>
                    <NoteChip
                      label="Resonant"
                      note={drum.resonant.target.note}
                      hz={drum.resonant.target.frequency}
                      color={drum.color}
                    />
                  </>
                )}
              </View>
            </View>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

function NoteChip({
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
    <View style={styles.noteChip}>
      <ThemedText style={styles.noteLabel}>{label}</ThemedText>
      <ThemedText style={[styles.noteValue, { color }]}>{note}</ThemedText>
      <ThemedText style={styles.noteHz}>{hz} Hz</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.6,
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  drumName: {
    fontSize: 17,
    fontWeight: '600',
  },
  sizeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  drumSize: {
    fontSize: 13,
    fontWeight: '600',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noteChip: {
    alignItems: 'center',
  },
  noteLabel: {
    fontSize: 10,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteValue: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  noteHz: {
    fontSize: 11,
    opacity: 0.5,
  },
  arrow: {
    opacity: 0.3,
    fontSize: 18,
    marginTop: 10,
  },
  chevron: {
    fontSize: 26,
    opacity: 0.25,
  },
});
