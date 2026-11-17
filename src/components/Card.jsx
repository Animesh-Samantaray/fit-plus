import React from 'react';
import { View, Text } from 'react-native';

const variantClasses = {
  default: 'bg-navy-900/90 border-slate-800/80 shadow-md',
  elevated: 'bg-surface-850 border-slate-700/60 shadow-xl shadow-black/40',
  glass: 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md shadow-lg',
  brand: 'bg-gradient-to-br from-brand-950/80 via-navy-900 to-navy-950 border-brand-500/30 shadow-lg shadow-brand-500/10',
  purple: 'bg-gradient-to-br from-purple-950/80 via-navy-900 to-navy-950 border-purple-500/30 shadow-lg shadow-purple-500/10',
};

export function Card({
  title,
  subtitle,
  icon = null,
  headerRight = null,
  variant = 'default',
  children,
  className = '',
  contentClassName = '',
}) {
  const chosenVariant = variantClasses[variant] || variantClasses.default;
  const hasHeader = title || subtitle || icon || headerRight;

  return (
    <View
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${chosenVariant} ${className}`}>
      {hasHeader && (
        <View className="flex-row items-center justify-between mb-4 pb-3.5 border-b border-slate-800/80">
          <View className="flex-row items-center space-x-3 flex-1 mr-2">
            {icon && (
              <View className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 items-center justify-center">
                {icon}
              </View>
            )}
            <View className="flex-1">
              {title && (
                <Text className="text-white font-bold text-base sm:text-lg tracking-tight">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}

      <View className={contentClassName}>{children}</View>
    </View>
  );
}
