import React, { useEffect } from 'react';
import { View, Text, Pressable, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Badge } from '@/components/Badge';
import { ShieldCheckIcon, CheckIcon, LockIcon } from '@/components/Icons';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';

export default function LandingScreen() {
  const router = useRouter();
  const { user, profile, role, isLoading } = useAuth();
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
    return <LoadingScreen message="Initializing HB+..." />;
  }

  return (
    <View className="flex-1 bg-navy-975 relative justify-between px-6 py-8 sm:py-12 max-w-lg mx-auto w-full">
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />

      {/* Ambient Lighting Gradients */}
      <View className="absolute top-0 left-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <View className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Section */}
      <View className="items-center text-center mt-2 sm:mt-6 z-10">
        <View className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 items-center justify-center shadow-xl shadow-brand-500/40 mb-4 border border-brand-300/30">
          <Text className="text-white font-black text-2xl sm:text-3xl tracking-wider">HB+</Text>
        </View>

        <View className="flex-row items-center space-x-2 mb-2">
          <Text className="text-white font-black text-2xl sm:text-3xl tracking-tight">HB+</Text>
          <Badge variant="brand" size="sm" label="Enterprise IAM" />
        </View>

        <Text className="text-slate-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
          Identity &amp; Access Management
        </Text>

        <View className="flex-row items-center bg-navy-900/90 border border-slate-800 px-3 py-1.5 rounded-full space-x-1.5 mb-4">
          <LockIcon size={12} color="#38bdf8" />
          <Text className="text-slate-300 text-xs font-medium">
            Official Domain:{' '}
            <Text className="text-brand-400 font-bold">@{allowedDomain}</Text>
          </Text>
        </View>

        <Text className="text-slate-300 text-xs sm:text-sm text-center leading-relaxed max-w-sm px-2">
          Welcome to the official internal platform for HB+. Authenticate with your corporate credentials to access your dashboard and tools.
        </Text>
      </View>

      {/* Feature Pills */}
      <View className="space-y-2 my-auto py-3 z-10">
        <View className="flex-row items-center space-x-2.5 bg-surface-850/70 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
          <View className="w-5 h-5 rounded-full bg-emerald-500/20 items-center justify-center">
            <CheckIcon size={12} color="#34d399" />
          </View>
          <Text className="text-slate-300 text-xs font-medium flex-1">
            Strict domain policy enforced (@{allowedDomain})
          </Text>
        </View>

        <View className="flex-row items-center space-x-2.5 bg-surface-850/70 border border-slate-800/80 px-3.5 py-2.5 rounded-xl">
          <View className="w-5 h-5 rounded-full bg-brand-500/20 items-center justify-center">
            <ShieldCheckIcon size={12} color="#38bdf8" />
          </View>
          <Text className="text-slate-300 text-xs font-medium flex-1">
            Google OAuth with verified email authentication
          </Text>
        </View>
      </View>

      {/* Bottom Action Section (Sign In & Sign Up) */}
      <View className="w-full z-10 pb-2">
        <Pressable
          onPress={() => router.push('/sign-in')}
          className="w-full bg-brand-500 active:bg-brand-600 py-3.5 px-6 rounded-2xl flex-row items-center justify-center shadow-lg shadow-brand-500/30 mb-3 active:scale-[0.99] transition-all"
          accessibilityRole="button"
          accessibilityLabel="Sign In">
          <Text className="text-white font-bold text-base tracking-tight">Sign In</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/sign-up')}
          className="w-full bg-surface-850 active:bg-surface-800 border border-slate-700/80 py-3.5 px-6 rounded-2xl flex-row items-center justify-center shadow-sm active:scale-[0.99] transition-all"
          accessibilityRole="button"
          accessibilityLabel="Sign Up">
          <Text className="text-slate-100 font-bold text-base tracking-tight">Sign Up</Text>
        </Pressable>

        {/* Security Micro Footer */}
        <View className="mt-4 items-center">
          <Text className="text-slate-500 text-[11px] text-center leading-tight">
            Reserved exclusively for authorized personnel.{'\n'}
            &copy; {new Date().getFullYear()} HB+ Technologies.
          </Text>
        </View>
      </View>
    </View>
  );
}
