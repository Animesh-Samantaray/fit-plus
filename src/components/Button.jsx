import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';

const variantStyles = {
  primary: {
    container: 'bg-brand-500 active:bg-brand-600 shadow-md shadow-brand-500/25 border-brand-400/30',
    text: 'text-white font-bold',
    spinner: '#ffffff',
  },
  secondary: {
    container: 'bg-slate-800 active:bg-slate-700 border border-slate-700 text-slate-200',
    text: 'text-slate-200 font-semibold',
    spinner: '#94a3b8',
  },
  purple: {
    container: 'bg-purple-600 active:bg-purple-700 shadow-md shadow-purple-600/25 border-purple-400/30',
    text: 'text-white font-bold',
    spinner: '#ffffff',
  },
  outline: {
    container: 'bg-transparent border border-slate-700 active:bg-slate-800/60',
    text: 'text-slate-300 font-semibold',
    spinner: '#94a3b8',
  },
  ghost: {
    container: 'bg-transparent active:bg-slate-800/40',
    text: 'text-slate-400 active:text-white font-medium',
    spinner: '#64748b',
  },
  danger: {
    container: 'bg-rose-600 active:bg-rose-700 shadow-md shadow-rose-600/20 border-rose-400/30',
    text: 'text-white font-bold',
    spinner: '#ffffff',
  },
};

const sizeStyles = {
  sm: 'py-2 px-3 rounded-lg text-xs',
  md: 'py-2.5 px-4 rounded-xl text-sm',
  lg: 'py-3.5 px-6 rounded-xl text-base',
};

export function Button({
  label,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
}) {
  const chosenVariant = variantStyles[variant] || variantStyles.primary;
  const chosenSize = sizeStyles[size] || sizeStyles.md;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center border transition-all active:scale-[0.98] ${
        chosenVariant.container
      } ${chosenSize} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      accessibilityRole="button">
      {loading ? (
        <ActivityIndicator size="small" color={chosenVariant.spinner} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          <Text className={`${chosenVariant.text} ${textClassName}`}>
            {label || children}
          </Text>
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </>
      )}
    </Pressable>
  );
}
