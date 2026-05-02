import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Palette } from '@/constants/theme';

type IconKey = 'kit' | 'tune' | 'presets' | 'profile';

function TabIcon({ name, color }: { name: IconKey; color: string }) {
  switch (name) {
    case 'kit':
      return <MaterialCommunityIcons name="record-circle-outline" size={20} color={color} />;
    case 'tune':
      return <Feather name="radio" size={18} color={color} />;
    case 'presets':
      return <MaterialCommunityIcons name="playlist-music" size={20} color={color} />;
    case 'profile':
      return <Feather name="user" size={18} color={color} />;
  }
}

const ROUTE_META: Record<string, { label: string; icon: IconKey }> = {
  index: { label: 'KIT', icon: 'kit' },
  explore: { label: 'TUNE', icon: 'tune' },
  presets: { label: 'PRESETS', icon: 'presets' },
  profile: { label: 'PROFILE', icon: 'profile' },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const meta = ROUTE_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const tintColor = focused ? Palette.bgPrimary : Palette.textTertiary;
          const onPress = () => {
            if (process.env.EXPO_OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, focused && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}>
              <TabIcon name={meta.icon} color={tintColor} />
              <Text style={[styles.label, { color: tintColor, fontWeight: focused ? '600' : '500' }]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 21,
    paddingTop: 12,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: Palette.bgSurface,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 4,
    height: 62,
    alignItems: 'stretch',
  },
  tab: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabActive: {
    backgroundColor: Palette.accent,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
