import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { palette } = useTheme();
  const overrideColor = palette.scheme === 'dark' ? darkColor : lightColor;
  const backgroundColor = overrideColor ?? palette.bgPrimary;
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
