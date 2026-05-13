import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { TEMPO_MARKINGS, tempoMarkingFor } from './constants';

type Props = {
  visible: boolean;
  bpm: number;
  onSelect: (bpm: number) => void;
  onClose: () => void;
};

export function TempoPicker({ visible, bpm, onSelect, onClose }: Props) {
  const active = tempoMarkingFor(bpm).name;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {TEMPO_MARKINGS.map((m) => {
              const isActive = m.name === active;
              return (
                <Pressable
                  key={m.name}
                  style={styles.row}
                  onPress={() => {
                    onSelect(m.min);
                    onClose();
                  }}>
                  <View style={[styles.bar, isActive && styles.barActive]} />
                  <ThemedText
                    style={[styles.range, isActive && styles.rangeActive]}>
                    {m.range}
                  </ThemedText>
                  <ThemedText
                    style={[styles.name, isActive && styles.nameActive]}>
                    {m.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    borderRadius: 14,
    backgroundColor: Palette.bgSurface,
    paddingVertical: 8,
  },
  list: { paddingVertical: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 14,
  },
  bar: {
    width: 2,
    alignSelf: 'stretch',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  barActive: { backgroundColor: Palette.accent },
  range: {
    width: 64,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  rangeActive: { color: Palette.accent },
  name: {
    flex: 1,
    fontSize: 16,
    fontStyle: 'italic',
    color: Palette.textSecondary,
  },
  nameActive: { color: Palette.accent },
});
