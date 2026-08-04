import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type ThemePalette } from '@/constants/theme';
import { useAuth, type AuthUser } from '@/hooks/use-auth';
import { useTheme, useThemedStyles, type ThemeMode } from '@/hooks/use-theme';

const TAB_BAR_SPACE = 100;
// The palette has no dedicated error color; use a fixed red for both themes.
const ERROR_COLOR = '#E5484D';

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
  const { user, login, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + TAB_BAR_SPACE },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText type="title">Profile</ThemedText>
          <ThemedText style={styles.subtitle}>Your kit, your preferences</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          {user ? (
            <AccountCard user={user} onLogout={logout} />
          ) : (
            <LoginCard onLogin={login} />
          )}
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
      </ScrollView>
    </ThemedView>
  );
}

/** Signed-in view: identity, plan badge, and sign-out. */
function AccountCard({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isPro = user.plan === 'pro';
  return (
    <View style={styles.accountCard}>
      <View style={styles.accountRow}>
        <View style={styles.avatar}>
          <Feather name="user" size={24} color={palette.accent} />
        </View>
        <View style={styles.accountText}>
          <ThemedText style={styles.accountName}>{user.displayName}</ThemedText>
          <ThemedText style={styles.accountEmail}>{user.email}</ThemedText>
          <View style={[styles.proBadge, !isPro && styles.freeBadge]}>
            {isPro && <Feather name="star" size={11} color={palette.bgPrimary} />}
            <ThemedText style={[styles.proBadgeText, !isPro && styles.freeBadgeText]}>
              {isPro ? 'PRO' : 'FREE'}
            </ThemedText>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onLogout}
        activeOpacity={0.8}
        accessibilityRole="button">
        <Feather name="log-out" size={16} color={palette.textSecondary} />
        <ThemedText style={styles.logoutLabel}>Sign out</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

/** Guest view: mock sign-in that unlocks Pro (the Kit tuner). */
function LoginCard({ onLogin }: { onLogin: (u: string, p: string) => Promise<string | null> }) {
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const err = await onLogin(username, password);
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <View style={styles.loginCard}>
      <ThemedText style={styles.loginTitle}>Sign in to unlock the tuner</ThemedText>
      <ThemedText style={styles.loginSubtitle}>
        Pro members get the Kit tuner. Free members keep the guide and metronome.
      </ThemedText>

      <View style={styles.field}>
        <ThemedText style={styles.fieldLabel}>Username</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={palette.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.fieldLabel}>Password</ThemedText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={palette.textTertiary}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
        />
      </View>

      {error && (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={13} color={ERROR_COLOR} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <TouchableOpacity
        style={[styles.loginBtn, submitting && styles.loginBtnDisabled]}
        onPress={onSubmit}
        disabled={submitting}
        activeOpacity={0.85}
        accessibilityRole="button">
        <ThemedText style={styles.loginBtnLabel}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </ThemedText>
      </TouchableOpacity>
    </View>
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

    // Account (signed in)
    accountCard: {
      backgroundColor: palette.bgSurface,
      borderRadius: 14,
      padding: 16,
      gap: 16,
    },
    accountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: palette.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountText: { flex: 1, gap: 4 },
    accountName: { fontSize: 17, fontWeight: '700', color: palette.textPrimary },
    accountEmail: { fontSize: 13, color: palette.textTertiary },
    proBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: palette.accent,
      marginTop: 1,
    },
    proBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.6,
      color: palette.bgPrimary,
    },
    freeBadge: {
      backgroundColor: palette.bgCard,
    },
    freeBadgeText: {
      color: palette.textSecondary,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: palette.bgCard,
    },
    logoutLabel: { fontSize: 15, fontWeight: '600', color: palette.textSecondary },

    // Login (guest)
    loginCard: {
      backgroundColor: palette.bgSurface,
      borderRadius: 14,
      padding: 16,
      gap: 12,
    },
    loginTitle: { fontSize: 16, fontWeight: '700', color: palette.textPrimary },
    loginSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: palette.textSecondary,
      marginBottom: 2,
    },
    field: { gap: 6 },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.textTertiary,
    },
    input: {
      height: 46,
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 15,
      color: palette.textPrimary,
      backgroundColor: palette.bgCard,
      borderWidth: 1,
      borderColor: palette.border,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    errorText: {
      flex: 1,
      fontSize: 13,
      color: ERROR_COLOR,
    },
    loginBtn: {
      height: 50,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.accent,
      marginTop: 4,
    },
    loginBtnDisabled: { opacity: 0.6 },
    loginBtnLabel: { fontSize: 16, fontWeight: '700', color: palette.bgPrimary },
  });
