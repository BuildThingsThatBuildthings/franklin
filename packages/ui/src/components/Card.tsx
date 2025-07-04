import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: boolean;
}

export function Card({
  children,
  style,
  padding = 'medium',
  shadow = true,
}: CardProps) {
  const paddingStyles: Record<string, ViewStyle> = {
    none: { padding: 0 },
    small: { padding: 8 },
    medium: { padding: 16 },
    large: { padding: 24 },
  };

  const shadowStyle: ViewStyle = shadow
    ? {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }
    : {};

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          borderRadius: 12,
        },
        paddingStyles[padding],
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}