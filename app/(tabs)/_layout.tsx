import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/custom-tab-bar';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const { palette } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.bgPrimary },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Kit' }} />
      <Tabs.Screen name="explore" options={{ title: 'Tune Guide' }} />
      <Tabs.Screen name="metronome" options={{ title: 'Metronome' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
