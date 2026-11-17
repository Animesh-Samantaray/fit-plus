import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { Badge } from '@/components/Badge';
import { LogOutIcon, ShieldIcon } from '@/components/Icons';

export function AppHeader({ title }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user, profile, role, logout, isActionLoading } = useAuth();
  const isAdmin = role === 'admin';
  const allowedDomain = getAllowedEmailDomain();

  const isDashboardActive = pathname.includes('/dashboard');
  const isAdminActive = pathname.includes('/admin');

  const pageTitle = title || (isAdminActive ? 'Admin Console' : 'Member Dashboard');

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 12) }}
      className="bg-navy-950/90 border-b border-slate-800/80 px-4 sm:px-8 pb-3.5 backdrop-blur-md sticky top-0 z-20">
      <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
        {/* Mobile Brand / Page Title */}
        <View className="flex-row items-center space-x-3">
          <View className="lg:hidden flex-row items-center space-x-2">
            <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 items-center justify-center shadow-sm">
              <Text className="text-white font-extrabold text-xs">HB+</Text>
            </View>
          </View>

          <View>
            <Text className="text-white font-extrabold text-base sm:text-lg tracking-tight">
              {pageTitle}
            </Text>
            <View className="flex-row items-center space-x-2 mt-0.5">
              <View className="w-2 h-2 rounded-full bg-emerald-400" />
              <Text className="text-slate-400 text-xs font-medium">
                Live Session &bull; @{allowedDomain}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Badges & Controls */}
        <View className="flex-row items-center space-x-2.5">
          {/* Quick role badge */}
          <Badge
            variant={isAdmin ? 'purple' : 'brand'}
            dot
            size="sm"
            label={isAdmin ? 'Administrator' : 'Member'}
          />

          {/* Quick Navigation switcher on Desktop if Admin */}
          {isAdmin && (
            <View className="hidden sm:flex flex-row items-center space-x-1.5 ml-2">
              <Pressable
                onPress={() => router.push('/(protected)/dashboard')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  isDashboardActive
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    isDashboardActive ? 'text-white' : 'text-slate-400'
                  }`}>
                  Member View
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/(protected)/admin')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  isAdminActive
                    ? 'bg-purple-950/60 border-purple-800 text-purple-200'
                    : 'border-transparent text-purple-400 hover:text-purple-300'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    isAdminActive ? 'text-purple-200' : 'text-purple-400'
                  }`}>
                  Admin View
                </Text>
              </Pressable>
            </View>
          )}

          {/* Quick Sign Out (visible on tablet/desktop) */}
          <Pressable
            onPress={logout}
            disabled={isActionLoading}
            className="hidden sm:flex flex-row items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 transition-all ml-2"
            accessibilityRole="button"
            accessibilityLabel="Sign out">
            {isActionLoading ? (
              <ActivityIndicator size="small" color="#94a3b8" />
            ) : (
              <>
                <LogOutIcon size={14} color="#94a3b8" />
                <Text className="text-slate-300 font-medium text-xs">Sign Out</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
