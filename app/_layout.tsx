import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AppLoading } from '@/components/app-loading';
import { AppSplash } from '@/components/app-splash';
import { Palette } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.bgPrimary,
    card: Palette.bgPrimary,
    text: Palette.textPrimary,
    border: Palette.border,
    primary: Palette.accent,
  },
};

const SPLASH_MS = 1400;

export default function RootLayout() {
  const [phase, setPhase] = useState<'splash' | 'loading' | 'ready'>('splash');


  useEffect(() => {
    if (phase !== 'splash') return;
    const t = setTimeout(() => setPhase('loading'), SPLASH_MS);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <ThemeProvider value={navTheme}>
      {phase === 'splash' && <AppSplash />}
      {phase === 'loading' && <AppLoading onDone={() => setPhase('ready')} />}
      {phase === 'ready' && (
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: Palette.bgPrimary },
            headerStyle: { backgroundColor: Palette.bgPrimary },
            headerTintColor: Palette.textPrimary,
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      )}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
