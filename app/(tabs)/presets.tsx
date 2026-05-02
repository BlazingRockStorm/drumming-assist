import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';

export default function PresetsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Presets</ThemedText>
        <ThemedText style={styles.subtitle}>Your saved tuning recipes</ThemedText>
      </View>
      <View style={styles.empty}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="playlist-music" size={36} color={Palette.accent} />
        </View>
        <ThemedText style={styles.emptyTitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.emptyDesc}>
          Save and recall complete tuning setups for any genre or song.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  subtitle: { marginTop: 4, color: Palette.textSecondary, fontSize: 14 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Palette.textPrimary },
  emptyDesc: {
    color: Palette.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
