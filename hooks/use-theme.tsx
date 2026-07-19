import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';

import { Palettes, type ThemeName, type ThemePalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemeMode = ThemeName | 'system';

const STORAGE_KEY = 'theme-mode';

type ThemeContextValue = {
  /** The user's preference, including 'system'. */
  mode: ThemeMode;
  /** The concrete theme currently in effect. */
  themeName: ThemeName;
  palette: ThemePalette;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || (value !== null && value in Palettes);
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (isThemeMode(saved)) setModeState(saved);
      })
      .catch(() => {});
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const themeName: ThemeName =
    mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo(
    () => ({ mode, themeName, palette: Palettes[themeName], setMode }),
    [mode, themeName, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within AppThemeProvider');
  return ctx;
}

/**
 * Build a StyleSheet from the active palette, re-created only when the theme
 * changes. The factory must be a stable (module-level) function.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (palette: ThemePalette) => T
): T {
  const { palette } = useTheme();
  return useMemo(() => factory(palette), [factory, palette]);
}
