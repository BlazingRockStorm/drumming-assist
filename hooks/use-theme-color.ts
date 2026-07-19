import { type Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ColorName) {
  const { palette } = useTheme();
  const colorFromProps = props[palette.scheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  switch (colorName) {
    case 'text':
      return palette.textPrimary;
    case 'background':
      return palette.bgPrimary;
    case 'tint':
    case 'tabIconSelected':
      return palette.accent;
    case 'icon':
      return palette.textSecondary;
    case 'tabIconDefault':
      return palette.textTertiary;
  }
}
