import { Platform } from 'react-native';

export const Palette = {
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

  snare: '#E74C3C',
  tom10: '#3498DB',
  tom12: '#9B59B6',
  tom13: '#1ABC9C',
  floor14: '#27AE60',
  floor16: '#16A085',
  bass: '#E67E22',
};

const tintColorLight = Palette.accent;
const tintColorDark = Palette.accent;

export const Colors = {
  light: {
    text: Palette.textPrimary,
    background: Palette.bgPrimary,
    tint: tintColorLight,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textTertiary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: Palette.textPrimary,
    background: Palette.bgPrimary,
    tint: tintColorDark,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textTertiary,
    tabIconSelected: tintColorDark,
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
