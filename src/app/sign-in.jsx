import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Badge } from '@/components/Badge';
import { ChevronLeftIcon, LockIcon, ShieldCheckIcon } from '@/components/Icons';

export default function SignInScreen() {
  const router = useRouter();
  const { user, profile, role, isLoading, isActionLoading, authError, signIn, clearError } =
    useAuth();

  const [localError, setLocalError] = useState(null);
  const allowedDomain = getAllowedEmailDomain();

  // If already authenticated with Firestore profile, redirect to role dashboard
  useEffect(() => {
    if (!isLoading && user && profile) {
      if (role === 'admin') {
        router.replace('/(protected)/admin');
      } else {
        router.replace('/(protected)/dashboard');
      }
    }
  }, [user, profile, role, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  const handleSignIn = async () => {
    setLocalError(null);
    clearError();

    try {
      const result = await signIn();
      if (result?.role === 'admin') {
        router.replace('/(protected)/admin');
      } else {
        router.replace('/(protected)/dashboard');
      }
    } catch (err) {
      // Error is caught and surfaced in AuthContext
    }
  };

  const activeError = localError || authError;
  const isProfileNotFound = activeError?.includes('Sign Up') || activeError?.includes('No registered HB+ account');

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-navy-975"
      keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      <View className="flex-1 justify-between px-6 py-8 sm:py-12 max-w-lg mx-auto w-full relative">
        {/* Ambient Lighting Gradients */}
        <View className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <View className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between z-10 mb-6">
          <Pressable
            onPress={() => router.push('/')}
            hitSlop={12}
            className="flex-row items-center space-x-1 py-1 px-2.5 rounded-xl bg-surface-850/80 border border-slate-800">
            <ChevronLeftIcon size={18} color="#94a3b8" />
            <Text className="text-slate-300 text-xs font-semibold">Home</Text>
          </Pressable>

          <View className="flex-row items-center space-x-2">
            <View className="w-7 h-7 rounded-lg bg-brand-500 items-center justify-center">
              <Text className="text-white font-black text-xs">HB+</Text>
            </View>
            <Text className="text-white font-bold text-sm tracking-tight">HB+</Text>
          </View>
        </View>

        {/* Main Card Content */}
        <View className="bg-surface-850/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-auto">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center space-x-2 mb-2">
              <Badge variant="brand" size="sm" label="Sign In" />
              <View className="flex-row items-center space-x-1 bg-navy-950/70 border border-slate-800 px-2.5 py-0.5 rounded-md">
                <LockIcon size={10} color="#38bdf8" />
                <Text className="text-brand-400 font-bold text-[11px]">@{allowedDomain}</Text>
              </View>
            </View>

            <Text className="text-white text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Welcome Back
            </Text>

            <Text className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Sign in with your official <Text className="text-slate-200 font-semibold">@{allowedDomain}</Text> Google Workspace credentials to continue.
            </Text>
          </View>

          {/* Error Banner */}
          {activeError && (
            <View className="mb-5">
              <ErrorMessage
                message={activeError}
                onDismiss={() => {
                  setLocalError(null);
                  clearError();
                }}
              />
              {isProfileNotFound && (
                <Pressable
                  onPress={() => {
                    clearError();
                    setLocalError(null);
                    router.push('/sign-up');
                  }}
                  className="mt-2 bg-brand-500/15 border border-brand-500/40 p-2.5 rounded-xl items-center">
                  <Text className="text-brand-300 text-xs font-bold">
                    Need an account? Tap here to Sign Up &rarr;
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Google Sign In Button */}
          <View className="items-center my-2">
            <GoogleSignInButton
              onPress={handleSignIn}
              label="Sign In with Google"
              loading={isActionLoading}
            />
          </View>

          {/* Security Policy Reminder */}
          <View className="mt-6 pt-5 border-t border-slate-800/80">
            <View className="flex-row items-center space-x-2 mb-1.5">
              <ShieldCheckIcon size={14} color="#38bdf8" />
              <Text className="text-slate-300 text-xs font-bold">Domain Policy</Text>
            </View>
            <Text className="text-slate-400 text-[11px] leading-relaxed">
              Personal Gmail, Yahoo, or other unauthorized domains will be rejected by security policy and signed out immediately.
            </Text>
          </View>
        </View>

        {/* Footer / Switch to Sign Up */}
        <View className="items-center z-10 pt-6">
          <Pressable
            onPress={() => {
              clearError();
              setLocalError(null);
              router.push('/sign-up');
            }}
            hitSlop={8}
            className="py-2 px-4 rounded-xl">
            <Text className="text-slate-400 text-xs">
              Don&apos;t have an account yet?{' '}
              <Text className="text-brand-400 font-bold">Sign Up here</Text>
            </Text>
          </Pressable>

          <Text className="text-slate-500 text-[11px] mt-2">
            Need support? Contact <Text className="text-slate-400">support@hbplus.fit</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
