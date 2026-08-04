import Feather from '@expo/vector-icons/Feather';
import { Redirect, Stack, router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KitVisualization } from '@/components/kit-visualization';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { KIT_PIECES, type KitPiece } from '@/constants/pieces';
import { type ThemePalette } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useKit } from '@/hooks/use-kit';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

const REMOVE_COLOR = '#FF5E5E';

export default function KitCustomizeScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { isPro, hydrated } = useAuth();
  const { inKit, isInKit, addPiece, removePiece } = useKit();

  // Part of the Pro-only Kit flow — guard direct/deep-link access.
  if (!hydrated) return null;
  if (!isPro) return <Redirect href="/metronome" />;

  const active = KIT_PIECES.filter((p) => !p.comingSoon && isInKit(p.id));
  const available = KIT_PIECES.filter((p) => !p.comingSoon && !isInKit(p.id));
  const comingSoon = KIT_PIECES.filter((p) => p.comingSoon);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.sideLeft}
          onPress={() => router.back()}
          accessibilityRole="button"
          hitSlop={8}>
          <Feather name="chevron-left" size={24} color={palette.accent} />
          <ThemedText style={styles.accentLabel}>Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Customize Kit</ThemedText>
        <TouchableOpacity
          style={styles.sideRight}
          onPress={() => router.back()}
          accessibilityRole="button"
          hitSlop={8}>
          <ThemedText style={styles.accentLabel}>Done</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hint}>
          <Feather name="sliders" size={14} color={palette.accent} />
          <ThemedText style={styles.hintText}>Add or remove pieces to build your kit.</ThemedText>
        </View>

        <View style={styles.canvasWrap}>
          <KitVisualization visible={inKit} />
        </View>

        <SectionHeader
          label="IN KIT"
          trailing={`${active.length} piece${active.length === 1 ? '' : 's'}`}
        />
        {active.map((p) => (
          <PieceRow key={p.id} piece={p} inKit onPress={() => removePiece(p.id)} />
        ))}

        <View style={styles.divider} />
        <SectionHeader label="AVAILABLE" trailing="Add to kit" />
        {available.length === 0 ? (
          <ThemedText style={styles.emptyNote}>Every piece is in your kit.</ThemedText>
        ) : (
          available.map((p) => (
            <PieceRow key={p.id} piece={p} inKit={false} onPress={() => addPiece(p.id)} />
          ))
        )}

        <View style={styles.divider} />
        <SectionHeader label="COMING SOON" />
        {comingSoon.map((p) => (
          <PieceRow key={p.id} piece={p} comingSoon />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

function SectionHeader({ label, trailing }: { label: string; trailing?: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      {trailing ? <ThemedText style={styles.sectionTrailing}>{trailing}</ThemedText> : null}
    </View>
  );
}

function PieceRow({
  piece,
  inKit,
  comingSoon,
  onPress,
}: {
  piece: KitPiece;
  inKit?: boolean;
  comingSoon?: boolean;
  onPress?: () => void;
}) {
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);
  const dotColor = comingSoon ? palette.textTertiary : piece.color ?? palette.textTertiary;
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <ThemedText style={[styles.rowName, !inKit && styles.rowNameMuted]}>{piece.name}</ThemedText>
      {comingSoon ? (
        <Feather name="clock" size={18} color={palette.textTertiary} />
      ) : (
        <TouchableOpacity
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${inKit ? 'Remove' : 'Add'} ${piece.name}`}
          hitSlop={8}>
          <Feather
            name={inKit ? 'minus-circle' : 'plus-circle'}
            size={22}
            color={inKit ? REMOVE_COLOR : palette.accent}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingBottom: 10,
    },
    sideLeft: {
      minWidth: 76,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sideRight: {
      minWidth: 76,
      alignItems: 'flex-end',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 17,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    accentLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: palette.accent,
    },
    scroll: {
      paddingHorizontal: 20,
    },
    hint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 9,
      backgroundColor: palette.accentSoft,
    },
    hintText: {
      fontSize: 13,
      fontWeight: '500',
      color: palette.accent,
    },
    canvasWrap: {
      marginTop: 14,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
      marginBottom: 2,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: palette.textTertiary,
    },
    sectionTrailing: {
      fontSize: 12,
      color: palette.textTertiary,
    },
    divider: {
      height: 1,
      marginTop: 16,
      backgroundColor: palette.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      height: 48,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    rowName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: palette.textPrimary,
    },
    rowNameMuted: {
      color: palette.textSecondary,
    },
    emptyNote: {
      fontSize: 13,
      color: palette.textTertiary,
      paddingVertical: 12,
    },
  });
