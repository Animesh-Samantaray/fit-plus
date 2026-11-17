import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function LoadingScreen({ message = 'Loading HB+...' }) {
  return (
    <View className="flex-1 bg-navy-975 items-center justify-center p-6">
      <View className="items-center max-w-sm">
        {/* Brand Logo Symbol */}
        <View className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 items-center justify-center mb-6 shadow-2xl shadow-brand-500/40 border border-brand-300/30">
          <Text className="text-white font-black text-2xl tracking-wider">HB+</Text>
        </View>

        <ActivityIndicator size="large" color="#38bdf8" className="mb-4" />

        <Text className="text-slate-300 text-sm font-semibold tracking-wide text-center">
          {message}
        </Text>
        <Text className="text-slate-500 text-xs mt-1 text-center font-medium">
          Verifying security state &bull; HB+ IAM
        </Text>
      </View>
    </View>
  );
}
