import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Palette } from '@/constants/theme';

const TAB_BAR_SPACE = 100;

const GUIDE_SECTIONS = [
  {
    title: 'Tuning Basics',
    items: [
      'Always tune in a star pattern: tighten opposite lugs in sequence.',
      'Tap near each lug — all should ring at the same pitch.',
      'Bring the head to pitch gradually; avoid over-tightening one spot.',
      'New heads need time to seat; re-tune after the first few uses.',
      'Back off all tension rods to finger-tight before starting.',
    ],
  },
  {
    title: 'Batter vs Resonant Heads',
    items: [
      'The batter head is what you strike; the reso sits on the bottom.',
      'Both heads interact — the reso controls sustain and tone character.',
      'A higher reso than batter gives a warmer, more focused tone.',
      'For toms, tune the reso a 3rd or 5th higher than the batter.',
      'Matching both heads gives maximum sustain and open tone.',
    ],
  },
  {
    title: 'Tom Cascade',
    items: [
      'Toms should descend in pitch from small to large (10" → 12" → floor).',
      'A perfect 5th interval between adjacent toms sounds musical.',
      'Consistent intervals make fills flow naturally from drum to drum.',
      '10" target: G3 · 12" target: D3 · Floor target: A2.',
      'Tune all toms before comparing — a slightly off drum stands out.',
    ],
  },
  {
    title: 'Snare Drum',
    items: [
      'Batter head at D4 gives a classic punchy rock crack.',
      'Resonant head slightly higher improves snare wire response.',
      'Too-tight snare wires produce a choked, metallic sound.',
      'Loosening one lug slightly on the batter gives a "fat" tuning.',
      'Snare side (reso) heads are thin and tension up quickly — go slow.',
    ],
  },
  {
    title: 'Bass Drum',
    items: [
      'Bass drum tuning is more about feel and style than a specific note.',
      'Tighter batter head = more attack, click, and definition.',
      'Looser batter head = more low-end boom and sustain.',
      'Foam or pillow muffling inside controls ring for studio tones.',
      'A small hole in the reso head allows mic placement and tone control.',
    ],
  },
  {
    title: 'Common Problems',
    items: [
      '"Wah" or wavering pitch: one lug is slightly out from the others.',
      'Dead / choked sound: head is too tight or has a crease/dent.',
      'Excessive ring: tune higher, or use light dampening (moon gel, tape).',
      'No sustain: head is over-tightened, or snare wires are too tight.',
      'Sympathetic ringing: nearby drum resonating when you hit another.',
    ],
  },
];

export default function GuideScreen() {
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
          <ThemedText type="title">Tuning Guide</ThemedText>
          <ThemedText style={styles.subtitle}>Everything you need to dial in your kit</ThemedText>
        </View>
        <View style={styles.list}>
          {GUIDE_SECTIONS.map((section) => (
            <Collapsible key={section.title} title={section.title}>
              {section.items.map((item, index) => (
                <View key={index} style={styles.tipRow}>
                  <View style={styles.bullet} />
                  <ThemedText style={styles.tipText}>{item}</ThemedText>
                </View>
              ))}
            </Collapsible>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: { gap: 4 },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 14,
  },
  list: { gap: 10 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.accent,
    marginTop: 8,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textSecondary,
  },
});
