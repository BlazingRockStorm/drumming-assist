import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GUIDE_SECTIONS } from '@/constants/guide';
import { Palette } from '@/constants/theme';

const TAB_BAR_SPACE = 100;

export default function GuideScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 22,
            paddingBottom: insets.bottom + TAB_BAR_SPACE,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Tuning Guide</ThemedText>
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
  header: { gap: 2 },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: 13,
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
    marginTop: 7,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
  },
});
