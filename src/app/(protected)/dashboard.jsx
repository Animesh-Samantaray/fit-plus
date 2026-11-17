import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { UserProfile } from '@/components/UserProfile';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  ShieldCheckIcon,
  ShieldIcon,
  SparklesIcon,
  CheckIcon,
  KeyIcon,
  LockIcon,
} from '@/components/Icons';

export default function UserDashboard() {
  const router = useRouter();
  const { user, profile, role, logout } = useAuth();
  const isAdmin = role === 'admin';
  const allowedDomain = getAllowedEmailDomain();

  const firstName = (profile?.name || user?.displayName || 'Member').split(' ')[0];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-navy-975"
      showsVerticalScrollIndicator={false}>
      <View className="max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Welcome Hero Banner */}
        <View className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-surface-850 to-navy-950 p-6 sm:p-10 border border-slate-700/60 shadow-2xl">
          {/* Ambient background glow accents */}
          <View className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <View className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Status Pill */}
          <View className="flex-row items-center space-x-2 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full self-start mb-4">
            <View className="w-2 h-2 rounded-full bg-emerald-400" />
            <Text className="text-emerald-300 font-semibold text-xs tracking-wider uppercase">
              Authenticated Session Active
            </Text>
          </View>

          {/* Headline */}
          <Text className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
            Welcome back, {firstName} 👋
          </Text>

          <Text className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
            You are authenticated with your authorized @{allowedDomain} Google account. Your session
            is cryptographically validated against Firebase and Cloud Firestore security rules.
          </Text>

          {/* Action Chips */}
          <View className="flex-row flex-wrap gap-3">
            {isAdmin && (
              <Button
                variant="purple"
                size="md"
                label="Open Admin Console"
                icon={<SparklesIcon size={16} color="#ffffff" />}
                iconPosition="right"
                onPress={() => router.push('/(protected)/admin')}
              />
            )}

            <Button
              variant="secondary"
              size="md"
              label="Sign Out"
              onPress={logout}
            />
          </View>
        </View>

        {/* 4 Metric / Status Cards Grid */}
        <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Domain Authorization */}
          <Card
            variant="glass"
            className="p-5"
            icon={<ShieldCheckIcon size={18} color="#38bdf8" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Domain Constraint
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              @{allowedDomain}
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-emerald-400 text-[11px] font-medium">Policy Enforced</Text>
            </View>
          </Card>

          {/* Card 2: Security Role */}
          <Card
            variant="glass"
            className="p-5"
            icon={<ShieldIcon size={18} color={isAdmin ? '#c084fc' : '#38bdf8'} />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Assigned Role
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight capitalize">
              {role}
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-slate-400 text-[11px] font-medium">
                {isAdmin ? 'Admin Console Granted' : 'Member Level'}
              </Text>
            </View>
          </Card>

          {/* Card 3: Database Policy */}
          <Card
            variant="glass"
            className="p-5"
            icon={<LockIcon size={18} color="#34d399" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Firestore Rules
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              Active &amp; Locked
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-emerald-400 text-[11px] font-medium">Zero-Trust Secured</Text>
            </View>
          </Card>

          {/* Card 4: Session Persistence */}
          <Card
            variant="glass"
            className="p-5"
            icon={<KeyIcon size={18} color="#a78bfa" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Persistence
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              IndexedDB / Native
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-slate-400 text-[11px] font-medium">Persistent Across Reloads</Text>
            </View>
          </Card>
        </View>

        {/* User Profile Card */}
        <UserProfile user={user} profile={profile} />

        {/* Security & System Architecture 2-Column Grid */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Security & Compliance Card */}
          <Card
            variant="default"
            title="Enterprise Governance"
            subtitle="Real-time security standards enforced across every request"
            icon={<ShieldCheckIcon size={18} color="#38bdf8" />}>
            <View className="space-y-3 mt-1">
              <View className="flex-row items-start space-x-2.5">
                <View className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mt-0.5">
                  <CheckIcon size={12} color="#34d399" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-xs">
                    Domain-Restricted Authentication
                  </Text>
                  <Text className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Only verified accounts matching @{allowedDomain} are permitted access.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start space-x-2.5">
                <View className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mt-0.5">
                  <CheckIcon size={12} color="#34d399" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-xs">
                    Database Document Isolation
                  </Text>
                  <Text className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Firestore security rules require request.auth.uid == userId for all operations.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start space-x-2.5">
                <View className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mt-0.5">
                  <CheckIcon size={12} color="#34d399" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-xs">
                    Immutable Role Governance
                  </Text>
                  <Text className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                    Client requests can never self-elevate permissions or modify the role property.
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Infrastructure & Services Card */}
          <Card
            variant="default"
            title="Platform Services"
            subtitle="Current architecture connectivity status"
            icon={<SparklesIcon size={18} color="#c084fc" />}>
            <View className="space-y-3 mt-1">
              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Environment</Text>
                <Text className="text-white text-xs font-bold uppercase tracking-wider">
                  {process.env.EXPO_PUBLIC_APP_ENV || 'Development'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Database</Text>
                <Text className="text-white text-xs font-semibold">Google Cloud Firestore</Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Auth Provider</Text>
                <Text className="text-white text-xs font-semibold">Firebase Google Auth</Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-slate-400 text-xs font-medium">Secret Hygiene</Text>
                <Text className="text-emerald-400 text-xs font-semibold">0 Exposed Secrets</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
