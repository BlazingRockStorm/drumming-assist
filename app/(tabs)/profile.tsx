import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type ThemePalette } from '@/constants/theme';
import { useTheme, useThemedStyles, type ThemeMode } from '@/hooks/use-theme';

const TAB_BAR_SPACE = 100;

const THEME_OPTIONS: {
  mode: ThemeMode;
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { mode: 'system', label: 'System', description: 'Match your phone setting', icon: 'smartphone' },
  { mode: 'dark', label: 'Dark', description: 'Always dark', icon: 'moon' },
  { mode: 'light', label: 'Light', description: 'Always light', icon: 'sun' },
  { mode: 'warm', label: 'Warm', description: 'Cozy sepia tones', icon: 'coffee' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode, palette } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + TAB_BAR_SPACE },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title">Profile</ThemedText>
          <ThemedText style={styles.subtitle}>Your kit, your preferences</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
          <View style={styles.optionCard}>
            {THEME_OPTIONS.map((option, index) => {
              const selected = mode === option.mode;
              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[styles.optionRow, index > 0 && styles.optionRowBorder]}
                  onPress={() => setMode(option.mode)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}>
                  <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                    <Feather
                      name={option.icon}
                      size={16}
                      color={selected ? palette.accent : palette.textSecondary}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <ThemedText style={styles.optionLabel}>{option.label}</ThemedText>
                    <ThemedText style={styles.optionDesc}>{option.description}</ThemedText>
                  </View>
                  {selected && <Feather name="check" size={18} color={palette.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.empty}>
          <View style={styles.iconWrap}>
            <Feather name="user" size={32} color={palette.accent} />
          </View>
          <ThemedText style={styles.emptyTitle}>Coming Soon</ThemedText>
          <ThemedText style={styles.emptyDesc}>
            Sign in to sync your kits and tunings across devices.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, gap: 24 },
    header: { paddingBottom: 0 },
    subtitle: { marginTop: 4, color: palette.textSecondary, fontSize: 14 },
    section: { gap: 10 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.textPrimary,
    },
    optionCard: {
      backgroundColor: palette.bgSurface,
      borderRadius: 14,
      overflow: 'hidden',
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    optionRowBorder: {
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    optionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.bgCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionIconSelected: {
      backgroundColor: palette.accentSoft,
    },
    optionText: { flex: 1, gap: 1 },
    optionLabel: { fontSize: 15, fontWeight: '600', color: palette.textPrimary },
    optionDesc: { fontSize: 12, color: palette.textTertiary },
    empty: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 12,
    },
    iconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: palette.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: palette.textPrimary },
    emptyDesc: {
      color: palette.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 280,
    },
  });
