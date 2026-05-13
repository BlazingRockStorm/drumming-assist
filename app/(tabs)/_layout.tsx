import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/custom-tab-bar';
import { Palette } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Palette.bgPrimary },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Kit' }} />
      <Tabs.Screen name="explore" options={{ title: 'Tune Guide' }} />
      <Tabs.Screen name="metronome" options={{ title: 'Metronome' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
