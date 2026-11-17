import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircleIcon, CloseIcon } from '@/components/Icons';

export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <View className="w-full bg-rose-950/80 border border-rose-500/40 rounded-2xl p-4 my-3 flex-row items-start justify-between shadow-lg shadow-rose-950/40">
      <View className="flex-row items-start flex-1 mr-2">
        <View className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/30 items-center justify-center mr-3 mt-0.5">
          <AlertCircleIcon size={16} color="#fb7185" />
        </View>
        <View className="flex-1">
          <Text className="text-rose-200 font-bold text-xs uppercase tracking-wider mb-0.5">
            Security &bull; Alert
          </Text>
          <Text className="text-rose-100 text-xs leading-relaxed font-normal">{message}</Text>
        </View>
      </View>

      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          className="p-1 rounded-lg hover:bg-rose-900/40 active:scale-95 transition-all"
          accessibilityLabel="Dismiss error">
          <CloseIcon size={14} color="#f43f5e" />
        </Pressable>
      )}
    </View>
  );
}
