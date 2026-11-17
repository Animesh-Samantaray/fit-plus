import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { UserProfile } from '@/components/UserProfile';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  ShieldIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckIcon,
  LockIcon,
  KeyIcon,
} from '@/components/Icons';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, role, logout } = useAuth();
  const allowedDomain = getAllowedEmailDomain();

  const adminName = profile?.name || user?.displayName || 'Administrator';

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-navy-975"
      showsVerticalScrollIndicator={false}>
      <View className="max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Admin Header Banner */}
        <View className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/90 via-surface-850 to-navy-950 p-6 sm:p-10 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
          {/* Ambient Glows */}
          <View className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <View className="absolute bottom-0 left-1/4 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Elevated Pill */}
          <View className="flex-row items-center space-x-2 bg-purple-900/60 border border-purple-500/40 px-3 py-1 rounded-full self-start mb-4">
            <View className="w-2 h-2 rounded-full bg-purple-400" />
            <Text className="text-purple-200 font-semibold text-xs tracking-wider uppercase">
              Elevated Privilege Console
            </Text>
          </View>

          {/* Title */}
          <Text className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
            Admin Console &bull; {adminName}
          </Text>

          <Text className="text-purple-100 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
            You are authenticated with verified administrative rights. Administrative privileges
            are validated directly against the Firestore security database.
          </Text>

          {/* Action Chips */}
          <View className="flex-row flex-wrap gap-3">
            <Button
              variant="outline"
              size="md"
              label="Switch to Member View"
              onPress={() => router.push('/(protected)/dashboard')}
            />

            <Button
              variant="secondary"
              size="md"
              label="Sign Out"
              onPress={logout}
            />
          </View>
        </View>

        {/* 4 Admin Metric Cards */}
        <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            variant="purple"
            className="p-5"
            icon={<ShieldIcon size={18} color="#c084fc" />}>
            <Text className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
              Privilege Level
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              Administrator
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-emerald-400 text-[11px] font-medium">Full Access Active</Text>
            </View>
          </Card>

          <Card
            variant="glass"
            className="p-5"
            icon={<KeyIcon size={18} color="#38bdf8" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Token Verification
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              Server Validated
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-emerald-400 text-[11px] font-medium">ADMIN_INVITE_TOKEN</Text>
            </View>
          </Card>

          <Card
            variant="glass"
            className="p-5"
            icon={<LockIcon size={18} color="#34d399" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Database Rule Policy
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              Read / Write Scope
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-slate-400 text-[11px] font-medium">Firestore Enforced</Text>
            </View>
          </Card>

          <Card
            variant="glass"
            className="p-5"
            icon={<SparklesIcon size={18} color="#c084fc" />}>
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Domain Boundary
            </Text>
            <Text className="text-white font-extrabold text-lg tracking-tight">
              @{allowedDomain}
            </Text>
            <View className="flex-row items-center space-x-1.5 mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Text className="text-slate-400 text-[11px] font-medium">Session Bound</Text>
            </View>
          </Card>
        </View>

        {/* User Profile Card */}
        <UserProfile user={user} profile={profile} />

        {/* Admin Architecture & Security Details 2-Column Grid */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Admin Role Assignment Guidelines */}
          <Card
            variant="default"
            title="Secure Admin Provisioning"
            subtitle="Adheres strictly to zero-trust principles and least-privilege access"
            icon={<ShieldIcon size={18} color="#c084fc" />}>
            <View className="space-y-3 mt-1">
              <View className="bg-navy-950/70 p-4 rounded-xl border border-slate-800">
                <View className="flex-row items-center space-x-2 mb-1">
                  <CheckIcon size={14} color="#34d399" />
                  <Text className="text-white font-semibold text-xs">
                    Server-Side Token Elevation Only
                  </Text>
                </View>
                <Text className="text-slate-400 text-xs leading-relaxed">
                  Admin roles can never be self-assigned via the client app. All role changes must
                  be provisioned securely through backend token validation or Firebase Admin SDK.
                </Text>
              </View>

              <View className="bg-navy-950/70 p-4 rounded-xl border border-slate-800">
                <View className="flex-row items-center space-x-2 mb-1">
                  <CheckIcon size={14} color="#34d399" />
                  <Text className="text-white font-semibold text-xs">
                    Enforced at Database Layer
                  </Text>
                </View>
                <Text className="text-slate-400 text-xs leading-relaxed">
                  Firestore Security Rules ensure client write requests cannot modify the{' '}
                  <Text className="font-mono text-purple-400 font-bold">role</Text> field.
                </Text>
              </View>
            </View>
          </Card>

          {/* System Telemetry & Access Overview */}
          <Card
            variant="default"
            title="Security Overview"
            subtitle="Real-time verified security parameters"
            icon={<ShieldCheckIcon size={18} color="#38bdf8" />}>
            <View className="space-y-3 mt-1">
              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Domain Enforced</Text>
                <Text className="text-emerald-400 font-semibold text-xs">@{allowedDomain}</Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Session Provider</Text>
                <Text className="text-white text-xs font-semibold">Firebase Google Auth</Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-xs font-medium">Current Role</Text>
                <Text className="text-purple-300 font-bold text-xs uppercase">{role}</Text>
              </View>

              <View className="flex-row justify-between items-center py-2">
                <Text className="text-slate-400 text-xs font-medium">Client Secrets</Text>
                <Text className="text-emerald-400 font-semibold text-xs">0 Exposed (Clean)</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
