import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BeatIndicator } from '@/components/metronome/beat-indicator';
import { BpmControl } from '@/components/metronome/bpm-control';
import { BpmSlider } from '@/components/metronome/bpm-slider';
import {
  beatCount,
  BPM_MAX,
  BPM_MIN,
  type Subdivision,
  type TimeSignature,
} from '@/components/metronome/constants';
import { SubdivisionPicker } from '@/components/metronome/subdivision-picker';
import { TempoPicker } from '@/components/metronome/tempo-picker';
import { TimeSignaturePicker } from '@/components/metronome/time-signature-picker';
import { useMetronomeEngine } from '@/components/metronome/use-metronome-engine';
import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

export default function MetronomeScreen() {
  const insets = useSafeAreaInsets();
  const [bpm, setBpm] = useState(120);
  const [timeSig, setTimeSig] = useState<TimeSignature>('4/4');
  const [subdivision, setSubdivision] = useState<Subdivision>('single');
  const [tempoPickerOpen, setTempoPickerOpen] = useState(false);

  const beats = beatCount(timeSig);
  const { isPlaying, setIsPlaying, activeBeat } = useMetronomeEngine(bpm, beats, subdivision);

  const adjust = (delta: number) =>
    setBpm((v) => Math.max(BPM_MIN, Math.min(BPM_MAX, v + delta)));

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 100 }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.title}>Metronome</ThemedText>
            <ThemedText style={styles.subtitle}>Set your tempo</ThemedText>
          </View>
          <Pressable
            style={styles.settingsBtn}
            accessibilityRole="button"
            onPress={() => setTempoPickerOpen(true)}>
            <Feather name="sliders" size={18} color={Palette.textSecondary} />
          </Pressable>
        </View>

        <BpmControl bpm={bpm} onAdjust={adjust} />
        <BeatIndicator beats={beats} activeBeat={activeBeat} isPlaying={isPlaying} />
        <BpmSlider bpm={bpm} onChange={setBpm} />
        <TimeSignaturePicker value={timeSig} onChange={setTimeSig} />
        <SubdivisionPicker value={subdivision} onChange={setSubdivision} />

        <Pressable
          style={styles.playBtn}
          onPress={() => setIsPlaying((v) => !v)}
          accessibilityRole="button">
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color={Palette.bgPrimary}
          />
          <ThemedText style={styles.playLabel}>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
        </Pressable>
      </View>

      <TempoPicker
        visible={tempoPickerOpen}
        bpm={bpm}
        onSelect={setBpm}
        onClose={() => setTempoPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.bgPrimary },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 25, fontWeight: '700', color: Palette.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Palette.textSecondary, marginTop: 2 },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Palette.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    marginTop: 'auto',
  },
  playLabel: { fontSize: 16, fontWeight: '700', color: Palette.bgPrimary },
});
