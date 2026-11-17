import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  DashboardIcon,
  ShieldIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '@/components/Icons';
import { Badge } from '@/components/Badge';

export function Sidebar({ collapsed, onToggleCollapse }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, role, logout } = useAuth();
  const isAdmin = role === 'admin';

  const isDashboardActive = pathname.includes('/dashboard');
  const isAdminActive = pathname.includes('/admin');

  const displayName = profile?.name || user?.displayName || 'HB+ Member';
  const photoURL = profile?.photoURL || user?.photoURL;
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'HB';

  return (
    <View
      className={`hidden lg:flex flex-col justify-between bg-navy-950 border-r border-slate-800/80 transition-all duration-200 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0`}>
      {/* Top Header & Brand */}
      <View className="p-4 border-b border-slate-800/80">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push('/(protected)/dashboard')}
            className="flex-row items-center space-x-3 active:opacity-80">
            <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 items-center justify-center shadow-md shadow-brand-500/25">
              <Text className="text-white font-black text-lg tracking-wider">HB+</Text>
            </View>
            {!collapsed && (
              <View>
                <Text className="text-white font-extrabold text-lg tracking-tight">HB+</Text>
                <Text className="text-slate-400 text-[10px] font-medium tracking-wide">
                  Enterprise IAM
                </Text>
              </View>
            )}
          </Pressable>

          {/* Collapse Toggle */}
          <Pressable
            onPress={onToggleCollapse}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
            accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? (
              <ChevronRightIcon size={16} color="#94a3b8" />
            ) : (
              <ChevronLeftIcon size={16} color="#94a3b8" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Navigation Links */}
      <View className="flex-1 p-3 space-y-1.5 mt-2">
        {/* Dashboard Link */}
        <Pressable
          onPress={() => router.push('/(protected)/dashboard')}
          className={`flex-row items-center rounded-xl transition-all ${
            collapsed ? 'justify-center p-3' : 'px-3.5 py-3 space-x-3'
          } ${
            isDashboardActive
              ? 'bg-brand-500/15 border border-brand-500/40 text-brand-300 shadow-sm'
              : 'hover:bg-slate-900 border border-transparent text-slate-400'
          }`}>
          <DashboardIcon
            size={20}
            color={isDashboardActive ? '#38bdf8' : '#94a3b8'}
          />
          {!collapsed && (
            <Text
              className={`text-sm font-semibold tracking-tight ${
                isDashboardActive ? 'text-white' : 'text-slate-400'
              }`}>
              Dashboard
            </Text>
          )}
        </Pressable>

        {/* Admin Console Link (Admin Only) */}
        {isAdmin && (
          <Pressable
            onPress={() => router.push('/(protected)/admin')}
            className={`flex-row items-center rounded-xl transition-all ${
              collapsed ? 'justify-center p-3' : 'px-3.5 py-3 space-x-3'
            } ${
              isAdminActive
                ? 'bg-purple-950/60 border border-purple-500/40 text-purple-200 shadow-sm'
                : 'hover:bg-slate-900 border border-transparent text-slate-400'
            }`}>
            <ShieldIcon
              size={20}
              color={isAdminActive ? '#c084fc' : '#a855f7'}
            />
            {!collapsed && (
              <View className="flex-1 flex-row items-center justify-between">
                <Text
                  className={`text-sm font-semibold tracking-tight ${
                    isAdminActive ? 'text-white' : 'text-purple-300'
                  }`}>
                  Admin Console
                </Text>
                <SparklesIcon size={14} color="#c084fc" />
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* User Profile Mini Footer */}
      <View className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <View className={`flex-row items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              className="w-9 h-9 rounded-xl border border-slate-700"
              resizeMode="cover"
            />
          ) : (
            <View className="w-9 h-9 rounded-xl bg-brand-500 items-center justify-center shadow-sm">
              <Text className="text-white font-bold text-xs">{initials}</Text>
            </View>
          )}

          {!collapsed && (
            <View className="flex-1 min-w-0">
              <Text className="text-white font-bold text-xs truncate" numberOfLines={1}>
                {displayName}
              </Text>
              <Badge
                variant={isAdmin ? 'purple' : 'brand'}
                size="sm"
                label={isAdmin ? 'Admin' : 'Member'}
                className="mt-0.5"
              />
            </View>
          )}

          {!collapsed && (
            <Pressable
              onPress={logout}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
              accessibilityLabel="Sign out">
              <LogOutIcon size={16} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        {collapsed && (
          <Pressable
            onPress={logout}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 items-center justify-center mt-3 hover:bg-slate-800 active:scale-95 transition-all self-center"
            accessibilityLabel="Sign out">
            <LogOutIcon size={16} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
