import Feather from '@expo/vector-icons/Feather';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import PitchSensor from '@/components/drum/pitch-sensor';
import { ThemedText } from '@/components/themed-text';
import { type ThemePalette } from '@/constants/theme';
import { type Drum, type DrumHeadTuning } from '@/constants/drums';
import { noteNameFromHz, useDrumTuner } from '@/hooks/use-drum-tuner';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

const PAD_HEIGHT = 300;
const LUG_SIZE = 34;
const RING_RADIUS = 122;
const SHELL_SIZE = 244;
const HEAD_SIZE = 184;

const LUG_COUNTS: Record<string, number> = {
  snare: 10,
  tom10: 6,
  tom12: 6,
  tom13: 6,
  floor14: 8,
  floor16: 8,
  bass: 8,
};

type HeadKey = 'batter' | 'reso';
type PitchKey = 'low' | 'target' | 'high';

const PITCH_OPTIONS: { key: PitchKey; label: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'target', label: 'Med' },
  { key: 'high', label: 'High' },
];

/** Star-pattern tuning order: lug i, then its opposite, around the drum. */
function tuningOrder(position: number, count: number): number {
  const half = count / 2;
  return position < half ? 2 * position + 1 : 2 * (position - half) + 2;
}

export function LugTuning({ drum }: { drum: Drum }) {
  const { palette } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [head, setHead] = useState<HeadKey>('batter');
  const [pitch, setPitch] = useState<PitchKey>('target');
  const [tuned, setTuned] = useState<Set<number>>(new Set());
  // Which lug the mic is currently judging. `null` means the reading is
  // treated as the drum as a whole, so no individual lug gets marked.
  const [selected, setSelected] = useState<number | null>(null);
  const [padWidth, setPadWidth] = useState(0);

  const lugCount = LUG_COUNTS[drum.id] ?? 8;
  const tuning: DrumHeadTuning = head === 'reso' && drum.resonant ? drum.resonant : drum.batter;
  const note = tuning[pitch];
  const pitchLabel = PITCH_OPTIONS.find((o) => o.key === pitch)?.label ?? '';

  const tuner = useDrumTuner(note.frequency);
  const reading = tuner.frequency !== null && tuner.cents !== null;
  const centsClamped = reading ? Math.max(-50, Math.min(50, tuner.cents as number)) : 0;
  const statusColor =
    tuner.status === 'in-tune' ? palette.success : reading ? drum.color : palette.textSecondary;
  const detectedLabel = reading
    ? noteNameFromHz(tuner.frequency as number)
    : tuner.isListening
      ? 'Listening…'
      : '—';
  const centsLabel = reading
    ? `${(tuner.cents as number) >= 0 ? '+' : '−'}${Math.abs(Math.round(tuner.cents as number))}¢`
    : '';

  const lugs = useMemo(() => {
    const cx = padWidth / 2;
    const cy = PAD_HEIGHT / 2;
    return Array.from({ length: lugCount }, (_, i) => {
      const angle = (-90 + (360 / lugCount) * i) * (Math.PI / 180);
      return {
        position: i,
        order: tuningOrder(i, lugCount),
        x: cx + RING_RADIUS * Math.cos(angle) - LUG_SIZE / 2,
        y: cy + RING_RADIUS * Math.sin(angle) - LUG_SIZE / 2,
      };
    });
  }, [lugCount, padWidth]);

  const onPadLayout = (e: LayoutChangeEvent) => setPadWidth(e.nativeEvent.layout.width);

  // Tapping a lug aims the mic at it; tapping it again goes back to judging
  // the whole drum. Either way the buffered samples belong to whatever was
  // being measured before, so they're dropped.
  const selectLug = (position: number) => {
    setSelected((prev) => (prev === position ? null : position));
    tuner.reset();
  };

  // Switching heads means striking a different surface — progress and any
  // buffered reading from the old head no longer apply.
  const selectHead = (key: HeadKey) => {
    if (key === head) return;
    setHead(key);
    setTuned(new Set());
    setSelected(null);
    tuner.reset();
  };

  // The verdict marks the lug, not the tap. A lug that measures in tune gets
  // checked; if a later re-check comes back flat or sharp the check comes off.
  useEffect(() => {
    if (selected === null) return;
    if (tuner.status !== 'in-tune' && tuner.status !== 'flat' && tuner.status !== 'sharp') return;
    const inTune = tuner.status === 'in-tune';
    setTuned((prev) => {
      if (prev.has(selected) === inTune) return prev;
      const next = new Set(prev);
      if (inTune) next.add(selected);
      else next.delete(selected);
      return next;
    });
  }, [tuner.status, selected]);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ThemedText style={styles.cardLabel}>Lug Tuning</ThemedText>
        {drum.resonant && (
          <View style={styles.headToggle}>
            {(['batter', 'reso'] as HeadKey[]).map((key) => {
              const active = head === key;
              return (
                <Pressable
                  key={key}
                  style={[styles.segment, active && { backgroundColor: drum.color }]}
                  onPress={() => selectHead(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <ThemedText style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                    {key === 'batter' ? 'Batter' : 'Reso'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.pitchRow}>
        {PITCH_OPTIONS.map((option) => {
          const active = pitch === option.key;
          const optionNote = tuning[option.key];
          return (
            <Pressable
              key={option.key}
              style={[
                styles.pitchChip,
                active && {
                  backgroundColor: drum.color + '18',
                  borderColor: drum.color,
                  borderWidth: 1.5,
                },
              ]}
              onPress={() => setPitch(option.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <ThemedText style={[styles.pitchLabel, active && { color: drum.color }]}>
                {option.label}
              </ThemedText>
              <ThemedText style={[styles.pitchNote, active && { color: drum.color }]}>
                {optionNote.note}
              </ThemedText>
              <ThemedText style={styles.pitchHz}>{optionNote.frequency} Hz</ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tunerPad} onLayout={onPadLayout}>
        {padWidth > 0 && (
          <>
            <View
              style={[
                styles.shell,
                {
                  left: padWidth / 2 - SHELL_SIZE / 2,
                  borderColor: drum.color,
                  backgroundColor: drum.color + '0D',
                },
              ]}
            />
            <View style={[styles.head, { left: padWidth / 2 - HEAD_SIZE / 2 }]} />
            <View style={[styles.centerInfo, { left: padWidth / 2 - 75 }]}>
              <ThemedText style={styles.centerTarget}>
                TARGET · {pitchLabel.toUpperCase()}
              </ThemedText>
              <ThemedText style={[styles.centerNote, { color: drum.color }]}>{note.note}</ThemedText>
              <ThemedText style={styles.centerHz}>{note.frequency} Hz</ThemedText>
              <View style={styles.centerDivider} />
              <View style={styles.progressRow}>
                <Feather name="check-circle" size={13} color={palette.success} />
                <ThemedText style={styles.progressText}>
                  {tuned.size} / {lugCount} tuned
                </ThemedText>
              </View>
            </View>
            {lugs.map((lug) => {
              const isTuned = tuned.has(lug.position);
              const isSelected = selected === lug.position;
              return (
                <Pressable
                  key={lug.position}
                  style={[
                    styles.lug,
                    { left: lug.x, top: lug.y },
                    isTuned && { backgroundColor: drum.color, borderColor: drum.color },
                    isSelected && styles.lugSelected,
                    isSelected && { borderColor: drum.color },
                  ]}
                  onPress={() => selectLug(lug.position)}
                  accessibilityRole="button"
                  accessibilityLabel={`Lug ${lug.order}${isTuned ? ', in tune' : ''}`}
                  accessibilityState={{ selected: isSelected }}>
                  {isTuned ? (
                    <Feather name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <ThemedText
                      style={[styles.lugNumber, isSelected && { color: drum.color }]}>
                      {lug.order}
                    </ThemedText>
                  )}
                </Pressable>
              );
            })}
          </>
        )}
      </View>

      <View style={styles.listenPanel}>
        <View style={styles.scopeRow}>
          <Feather
            name={selected === null ? 'disc' : 'crosshair'}
            size={13}
            color={selected === null ? palette.textTertiary : drum.color}
          />
          <ThemedText style={styles.scopeText}>
            {selected === null
              ? 'Checking whole drum'
              : `Checking lug ${tuningOrder(selected, lugCount)}`}
          </ThemedText>
        </View>
        <View style={styles.meterTop}>
          <ThemedText
            style={[
              styles.meterEndLabel,
              tuner.status === 'flat' && { color: drum.color, fontWeight: '700' },
            ]}>
            ♭ FLAT
          </ThemedText>
          <View style={styles.detected}>
            <ThemedText style={[styles.detectedNote, { color: statusColor }]}>
              {detectedLabel}
            </ThemedText>
            {reading && <ThemedText style={styles.detectedCents}>{centsLabel}</ThemedText>}
          </View>
          <ThemedText
            style={[
              styles.meterEndLabel,
              tuner.status === 'sharp' && { color: drum.color, fontWeight: '700' },
            ]}>
            SHARP ♯
          </ThemedText>
        </View>
        <View style={styles.meterTrack}>
          <View style={styles.centerTick} />
          {reading && (
            <View
              style={[
                styles.needle,
                { left: `${50 + centsClamped}%`, backgroundColor: statusColor },
              ]}
            />
          )}
        </View>
      </View>

      <Pressable
        style={[styles.listenBtn, tuner.isListening && styles.listenBtnActive]}
        onPress={() => (tuner.isListening ? tuner.stop() : tuner.start())}
        accessibilityRole="button"
        accessibilityState={{ selected: tuner.isListening }}>
        <Feather
          name={tuner.isListening ? 'mic-off' : 'mic'}
          size={20}
          color={tuner.isListening ? palette.textPrimary : palette.bgPrimary}
        />
        <ThemedText style={[styles.listenLabel, tuner.isListening && styles.listenLabelActive]}>
          {tuner.isListening ? 'Stop' : 'Listen'}
        </ThemedText>
      </Pressable>

      {tuner.error && <ThemedText style={styles.errorText}>{tuner.error}</ThemedText>}

      {tuner.isListening && (
        <PitchSensor
          onPitch={async (hz) => tuner.feed(hz)}
          onError={async (message) => tuner.fail(message)}
          dom={{
            style: { width: 1, height: 1, opacity: 0, position: 'absolute' },
            mediaCapturePermissionGrantType: 'grant',
          }}
        />
      )}

      <View style={styles.footRow}>
        <View style={styles.hint}>
          <Feather name="target" size={15} color={drum.color} />
          <ThemedText style={styles.hintText}>
            {selected === null
              ? `Strike near the head's centre to check the whole drum, or tap a lug to check it on its own.`
              : `Strike beside lug ${tuningOrder(selected, lugCount)} — it checks itself once the pitch settles on ${note.note}. Work the numbered star pattern for even tension.`}
          </ThemedText>
        </View>
        <Pressable
          style={styles.resetBtn}
          onPress={() => {
            setTuned(new Set());
            setSelected(null);
            tuner.reset();
          }}
          accessibilityRole="button">
          <Feather name="rotate-ccw" size={14} color={palette.textSecondary} />
          <ThemedText style={styles.resetLabel}>Reset</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 20,
      gap: 16,
      backgroundColor: palette.bgSurface,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardLabel: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: palette.textTertiary,
    },
    headToggle: {
      flexDirection: 'row',
      gap: 2,
      padding: 3,
      borderRadius: 10,
      backgroundColor: palette.bgCard,
    },
    segment: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
    },
    segmentLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: palette.textSecondary,
    },
    segmentLabelActive: {
      fontWeight: '600',
      color: '#FFFFFF',
    },
    pitchRow: {
      flexDirection: 'row',
      gap: 8,
    },
    pitchChip: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 10,
      backgroundColor: palette.bgCard,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    pitchLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.textSecondary,
    },
    pitchNote: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    pitchHz: {
      fontSize: 11,
      color: palette.textTertiary,
    },
    tunerPad: {
      height: PAD_HEIGHT,
      position: 'relative',
    },
    shell: {
      position: 'absolute',
      top: (PAD_HEIGHT - SHELL_SIZE) / 2,
      width: SHELL_SIZE,
      height: SHELL_SIZE,
      borderRadius: SHELL_SIZE / 2,
      borderWidth: 2,
    },
    head: {
      position: 'absolute',
      top: (PAD_HEIGHT - HEAD_SIZE) / 2,
      width: HEAD_SIZE,
      height: HEAD_SIZE,
      borderRadius: HEAD_SIZE / 2,
      backgroundColor: palette.bgCard,
      borderWidth: 1,
      borderColor: palette.border,
    },
    centerInfo: {
      position: 'absolute',
      top: PAD_HEIGHT / 2 - 58,
      width: 150,
      alignItems: 'center',
      gap: 2,
    },
    centerTarget: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.6,
      color: palette.textTertiary,
    },
    centerNote: {
      fontSize: 34,
      fontWeight: '700',
      lineHeight: 40,
    },
    centerHz: {
      fontSize: 12,
      color: palette.textTertiary,
    },
    centerDivider: {
      width: 44,
      height: 1,
      marginVertical: 4,
      backgroundColor: palette.border,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.textSecondary,
    },
    lug: {
      position: 'absolute',
      width: LUG_SIZE,
      height: LUG_SIZE,
      borderRadius: LUG_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.bgElevated,
      borderWidth: 1.5,
      borderColor: palette.border,
    },
    lugSelected: {
      borderWidth: 3,
      transform: [{ scale: 1.15 }],
    },
    lugNumber: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.textSecondary,
    },
    scopeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    scopeText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.textSecondary,
    },
    listenPanel: {
      borderRadius: 12,
      padding: 14,
      gap: 10,
      backgroundColor: palette.bgCard,
    },
    meterTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    meterEndLabel: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: palette.textTertiary,
    },
    detected: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    detectedNote: {
      fontSize: 15,
      fontWeight: '700',
    },
    detectedCents: {
      fontSize: 13,
      fontWeight: '500',
      color: palette.textSecondary,
    },
    meterTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: palette.bgElevated,
      position: 'relative',
    },
    centerTick: {
      position: 'absolute',
      left: '50%',
      top: -4,
      width: 2,
      height: 16,
      marginLeft: -1,
      borderRadius: 1,
      backgroundColor: palette.border,
    },
    needle: {
      position: 'absolute',
      top: -4,
      width: 4,
      height: 16,
      marginLeft: -2,
      borderRadius: 2,
    },
    listenBtn: {
      height: 52,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: palette.accent,
    },
    listenBtnActive: {
      backgroundColor: palette.bgElevated,
      borderWidth: 1,
      borderColor: palette.border,
    },
    listenLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.bgPrimary,
    },
    listenLabelActive: {
      color: palette.textPrimary,
    },
    errorText: {
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
      color: palette.textSecondary,
    },
    footRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    hint: {
      flex: 1,
      flexDirection: 'row',
      gap: 8,
    },
    hintText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
      color: palette.textSecondary,
    },
    resetBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 9,
      backgroundColor: palette.bgCard,
    },
    resetLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: palette.textSecondary,
    },
  });
