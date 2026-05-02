import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <ThemedText type="title">Profile</ThemedText>
        <ThemedText style={styles.subtitle}>Your kit, your preferences</ThemedText>
      </View>
      <View style={styles.empty}>
        <View style={styles.iconWrap}>
          <Feather name="user" size={32} color={Palette.accent} />
        </View>
        <ThemedText style={styles.emptyTitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.emptyDesc}>
          Sign in to sync your kits and tunings across devices.
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
