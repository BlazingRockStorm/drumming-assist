import { Platform } from 'react-native';

export type ThemePalette = {
  /** Whether this theme is dark- or light-styled; drives status bar and nav theme. */
  scheme: 'dark' | 'light';

  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  bgElevated: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  accent: string;
  accentSoft: string;
  success: string;

  snare: string;
  tom10: string;
  tom12: string;
  tom13: string;
  floor14: string;
  floor16: string;
  bass: string;
};

export const DrumColors = {
  snare: '#E74C3C',
  tom10: '#3498DB',
  tom12: '#9B59B6',
  tom13: '#1ABC9C',
  floor14: '#27AE60',
  floor16: '#16A085',
  bass: '#E67E22',
};

export const DarkPalette: ThemePalette = {
  scheme: 'dark',

  bgPrimary: '#0D0D0F',
  bgSurface: '#1A1A1E',
  bgCard: '#222228',
  bgElevated: '#2A2A30',
  border: '#2E2E34',

  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textTertiary: '#6B6B73',

  accent: '#2ECC71',
  accentSoft: '#2ECC7133',
  success: '#27AE60',

  ...DrumColors,
};

export const LightPalette: ThemePalette = {
  scheme: 'light',

  bgPrimary: '#F6F6F8',
  bgSurface: '#FFFFFF',
  bgCard: '#EDEDF1',
  bgElevated: '#E4E4EA',
  border: '#DCDCE2',

  textPrimary: '#151518',
  textSecondary: '#5C5C66',
  textTertiary: '#8A8A94',

  accent: '#1FA85C',
  accentSoft: '#1FA85C22',
  success: '#1E9E53',

  ...DrumColors,
};

export const WarmPalette: ThemePalette = {
  scheme: 'light',

  bgPrimary: '#F3EBDD',
  bgSurface: '#FBF5EA',
  bgCard: '#ECE0CB',
  bgElevated: '#E3D5BB',
  border: '#D8C8AB',

  textPrimary: '#33291A',
  textSecondary: '#6E5F47',
  textTertiary: '#98876B',

  accent: '#C4762A',
  accentSoft: '#C4762A26',
  success: '#4F8A43',

  ...DrumColors,
};

export const Palettes = {
  dark: DarkPalette,
  light: LightPalette,
  warm: WarmPalette,
} as const;

export type ThemeName = keyof typeof Palettes;

export const Colors = {
  light: {
    text: LightPalette.textPrimary,
    background: LightPalette.bgPrimary,
    tint: LightPalette.accent,
    icon: LightPalette.textSecondary,
    tabIconDefault: LightPalette.textTertiary,
    tabIconSelected: LightPalette.accent,
  },
  dark: {
    text: DarkPalette.textPrimary,
    background: DarkPalette.bgPrimary,
    tint: DarkPalette.accent,
    icon: DarkPalette.textSecondary,
    tabIconDefault: DarkPalette.textTertiary,
    tabIconSelected: DarkPalette.accent,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
