import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardIcon, ShieldIcon, LogOutIcon } from '@/components/Icons';

export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { role, logout } = useAuth();
  const isAdmin = role === 'admin';

  const isDashboardActive = pathname.includes('/dashboard');
  const isAdminActive = pathname.includes('/admin');

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="lg:hidden bg-navy-950/95 border-t border-slate-800/90 backdrop-blur-md px-4 pt-2.5">
      <View className="flex-row items-center justify-around max-w-md mx-auto w-full">
        {/* Dashboard Tab */}
        <Pressable
          onPress={() => router.push('/(protected)/dashboard')}
          className={`flex-1 items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
            isDashboardActive
              ? 'bg-brand-500/15 border border-brand-500/30'
              : 'border border-transparent'
          }`}
          accessibilityRole="tab"
          accessibilityLabel="Dashboard">
          <DashboardIcon
            size={22}
            color={isDashboardActive ? '#38bdf8' : '#64748b'}
          />
          <Text
            className={`text-[11px] font-semibold mt-1 ${
              isDashboardActive ? 'text-brand-300' : 'text-slate-500'
            }`}>
            Dashboard
          </Text>
        </Pressable>

        {/* Admin Console Tab (If Admin) */}
        {isAdmin && (
          <Pressable
            onPress={() => router.push('/(protected)/admin')}
            className={`flex-1 items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              isAdminActive
                ? 'bg-purple-950/60 border border-purple-500/30'
                : 'border border-transparent'
            }`}
            accessibilityRole="tab"
            accessibilityLabel="Admin Console">
            <ShieldIcon
              size={22}
              color={isAdminActive ? '#c084fc' : '#64748b'}
            />
            <Text
              className={`text-[11px] font-semibold mt-1 ${
                isAdminActive ? 'text-purple-300' : 'text-slate-500'
              }`}>
              Admin
            </Text>
          </Pressable>
        )}

        {/* Logout Tab */}
        <Pressable
          onPress={logout}
          className="flex-1 items-center justify-center py-1.5 px-3 rounded-xl border border-transparent active:bg-slate-900"
          accessibilityRole="button"
          accessibilityLabel="Sign out">
          <LogOutIcon size={22} color="#64748b" />
          <Text className="text-[11px] font-semibold text-slate-500 mt-1">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
