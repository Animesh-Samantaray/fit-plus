import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';

/**
 * Clean SVG-free Google 'G' Mark using crisp colored elements
 */
function GoogleIcon() {
  return (
    <View className="w-5 h-5 items-center justify-center mr-3 rounded-full bg-white border border-slate-200/80 shadow-sm">
      <Text className="font-black text-sm text-blue-600">G</Text>
    </View>
  );
}

export function GoogleSignInButton({
  onPress,
  label = 'Sign in with Google',
  loading = false,
  disabled = false,
}) {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`w-full max-w-sm flex-row items-center justify-center py-3.5 px-6 rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-black/20 transition-all active:scale-[0.98] ${
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'active:bg-slate-100 hover:bg-slate-50'
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}>
      {loading ? (
        <ActivityIndicator size="small" color="#0e8ce9" />
      ) : (
        <>
          <GoogleIcon />
          <Text className="text-slate-800 font-bold text-sm sm:text-base tracking-tight">
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
