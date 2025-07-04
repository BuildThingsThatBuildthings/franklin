import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const baseStyle: ViewStyle = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 6, paddingHorizontal: 12 },
    medium: { paddingVertical: 10, paddingHorizontal: 20 },
    large: { paddingVertical: 14, paddingHorizontal: 28 },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: disabled ? colors.gray[400] : colors.richRed,
    },
    secondary: {
      backgroundColor: disabled ? colors.gray[400] : colors.deepBlue,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? colors.gray[400] : colors.deepBlue,
    },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    primary: { color: 'white' },
    secondary: { color: 'white' },
    outline: { color: disabled ? colors.gray[400] : colors.deepBlue },
  };

  const textSizeStyles: Record<string, TextStyle> = {
    small: { fontSize: 14 },
    medium: { fontSize: 16 },
    large: { fontSize: 18 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        baseStyle,
        sizeStyles[size],
        variantStyles[variant],
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.deepBlue : 'white'}
          size="small"
        />
      ) : (
        <Text
          style={[
            { fontWeight: '600' },
            textSizeStyles[size],
            textVariantStyles[variant],
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}