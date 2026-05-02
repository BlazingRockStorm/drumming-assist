import { View, type ViewProps } from 'react-native';

import { Palette } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = darkColor ?? lightColor ?? Palette.bgPrimary;
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
