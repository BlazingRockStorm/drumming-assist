import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import 'react-native-reanimated';

import { AppLoading } from '@/components/app-loading';
import { AppSplash } from '@/components/app-splash';
import { AuthProvider } from '@/hooks/use-auth';
import { AppThemeProvider, useTheme } from '@/hooks/use-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const SPLASH_MS = 1400;

function RootNavigator() {
  const { palette } = useTheme();
  const [phase, setPhase] = useState<'splash' | 'loading' | 'ready'>('splash');

  const navTheme = useMemo(() => {
    const base = palette.scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: palette.bgPrimary,
        card: palette.bgPrimary,
        text: palette.textPrimary,
        border: palette.border,
        primary: palette.accent,
      },
    };
  }, [palette]);

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
            contentStyle: { backgroundColor: palette.bgPrimary },
            headerStyle: { backgroundColor: palette.bgPrimary },
            headerTintColor: palette.textPrimary,
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      )}
      <StatusBar style={palette.scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AppThemeProvider>
  );
}
