import React from 'react';
import { View, Text } from 'react-native';

const variantStyles = {
  brand: {
    container: 'bg-brand-950/70 border-brand-500/30 text-brand-300',
    dot: 'bg-brand-400',
    text: 'text-brand-300',
  },
  purple: {
    container: 'bg-purple-950/70 border-purple-500/30 text-purple-300',
    dot: 'bg-purple-400',
    text: 'text-purple-300',
  },
  success: {
    container: 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
  },
  warning: {
    container: 'bg-amber-950/70 border-amber-500/30 text-amber-300',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
  },
  neutral: {
    container: 'bg-slate-900/80 border-slate-700/60 text-slate-300',
    dot: 'bg-slate-400',
    text: 'text-slate-300',
  },
};

export function Badge({
  label,
  variant = 'brand',
  dot = false,
  size = 'md',
  icon = null,
  children,
  className = '',
}) {
  const currentVariant = variantStyles[variant] || variantStyles.brand;
  const isSmall = size === 'sm';

  return (
    <View
      className={`flex-row items-center border rounded-full self-start ${
        currentVariant.container
      } ${isSmall ? 'px-2 py-0.5' : 'px-3 py-1'} ${className}`}>
      {dot && (
        <View
          className={`rounded-full mr-1.5 ${
            isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'
          } ${currentVariant.dot}`}
        />
      )}
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text
        className={`font-semibold uppercase tracking-wider ${
          isSmall ? 'text-[10px]' : 'text-xs'
        } ${currentVariant.text}`}>
        {label || children}
      </Text>
    </View>
  );
}
