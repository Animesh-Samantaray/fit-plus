import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Badge } from '@/components/Badge';
import {
  ChevronLeftIcon,
  ShieldIcon,
  UserIcon,
  LockIcon,
  ShieldCheckIcon,
} from '@/components/Icons';

export default function SignUpScreen() {
  const router = useRouter();
  const { user, profile, role, isLoading, isActionLoading, authError, signUp, clearError } =
    useAuth();

  const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'
  const [adminToken, setAdminToken] = useState('');
  const [showToken, setShowToken] = useState(false);
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

  const handleSignUp = async () => {
    setLocalError(null);
    clearError();

    if (selectedRole === 'admin' && !adminToken.trim()) {
      setLocalError('Administrator invitation token is required for Admin registration.');
      return;
    }

    try {
      const result = await signUp({
        role: selectedRole,
        adminToken: adminToken.trim(),
      });
      if (result?.role === 'admin') {
        router.replace('/(protected)/admin');
      } else {
        router.replace('/(protected)/dashboard');
      }
    } catch {
      // Error is caught and surfaced in AuthContext
    }
  };

  const activeError = localError || authError;

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
          <View className="mb-5">
            <View className="flex-row items-center space-x-2 mb-2">
              <Badge variant="purple" size="sm" label="Sign Up" />
              <View className="flex-row items-center space-x-1 bg-navy-950/70 border border-slate-800 px-2.5 py-0.5 rounded-md">
                <LockIcon size={10} color="#38bdf8" />
                <Text className="text-brand-400 font-bold text-[11px]">@{allowedDomain}</Text>
              </View>
            </View>

            <Text className="text-white text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Create HB+ Account
            </Text>

            <Text className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Register your verified <Text className="text-slate-200 font-semibold">@{allowedDomain}</Text> Google account to access the platform.
            </Text>
          </View>

          {/* Error Banner */}
          {activeError && (
            <View className="mb-4">
              <ErrorMessage
                message={activeError}
                onDismiss={() => {
                  setLocalError(null);
                  clearError();
                }}
              />
            </View>
          )}

          {/* Role Selection */}
          <View className="mb-5">
            <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              Select Account Role
            </Text>

            <View className="flex-row space-x-3">
              {/* Member Option */}
              <Pressable
                onPress={() => {
                  setSelectedRole('user');
                  setLocalError(null);
                  clearError();
                }}
                className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                  selectedRole === 'user'
                    ? 'border-brand-500 bg-brand-500/15 shadow-sm'
                    : 'border-slate-800 bg-navy-950/70'
                }`}>
                <View className="flex-row items-center space-x-2 mb-1">
                  <UserIcon size={16} color={selectedRole === 'user' ? '#38bdf8' : '#94a3b8'} />
                  <Text
                    className={`font-bold text-sm ${
                      selectedRole === 'user' ? 'text-white' : 'text-slate-300'
                    }`}>
                    Member
                  </Text>
                </View>
                <Text className="text-slate-400 text-[11px]">Standard Access</Text>
              </Pressable>

              {/* Admin Option */}
              <Pressable
                onPress={() => {
                  setSelectedRole('admin');
                  setLocalError(null);
                  clearError();
                }}
                className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                  selectedRole === 'admin'
                    ? 'border-purple-500 bg-purple-500/15 shadow-sm'
                    : 'border-slate-800 bg-navy-950/70'
                }`}>
                <View className="flex-row items-center space-x-2 mb-1">
                  <ShieldIcon size={16} color={selectedRole === 'admin' ? '#c084fc' : '#94a3b8'} />
                  <Text
                    className={`font-bold text-sm ${
                      selectedRole === 'admin' ? 'text-white' : 'text-slate-300'
                    }`}>
                    Admin
                  </Text>
                </View>
                <Text className="text-slate-400 text-[11px]">Token Required</Text>
              </Pressable>
            </View>

            {/* Admin Invitation Token Field */}
            {selectedRole === 'admin' && (
              <View className="mt-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-purple-200 text-xs font-bold uppercase tracking-wider">
                    Admin Invitation Token
                  </Text>
                  <Pressable onPress={() => setShowToken(!showToken)} hitSlop={8}>
                    <Text className="text-purple-400 text-[11px] font-semibold">
                      {showToken ? 'Hide' : 'Show'}
                    </Text>
                  </Pressable>
                </View>
                <TextInput
                  value={adminToken}
                  onChangeText={(val) => {
                    setAdminToken(val);
                    setLocalError(null);
                  }}
                  placeholder="Enter authorized admin token"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showToken}
                  autoCapitalize="none"
                  className="w-full px-4 py-2.5 bg-navy-950 border border-purple-500/40 rounded-xl text-white text-sm"
                />
                <Text className="text-purple-300 text-[11px] mt-1.5 leading-relaxed">
                  Token is verified securely against the backend server before account creation.
                </Text>
              </View>
            )}
          </View>

          {/* Google Sign Up Button */}
          <View className="items-center my-2">
            <GoogleSignInButton
              onPress={handleSignUp}
              label={
                selectedRole === 'admin'
                  ? 'Verify & Sign Up as Admin'
                  : 'Sign Up with Google'
              }
              loading={isActionLoading}
            />
          </View>

          {/* Security Note */}
          <View className="mt-5 pt-4 border-t border-slate-800/80">
            <View className="flex-row items-center space-x-2 mb-1">
              <ShieldCheckIcon size={14} color="#38bdf8" />
              <Text className="text-slate-300 text-xs font-bold">Policy Enforcement</Text>
            </View>
            <Text className="text-slate-400 text-[11px] leading-relaxed">
              Only verified Google accounts under @{allowedDomain} are authorized. Non-official domains will be rejected immediately.
            </Text>
          </View>
        </View>

        {/* Footer / Switch to Sign In */}
        <View className="items-center z-10 pt-6">
          <Pressable
            onPress={() => {
              clearError();
              setLocalError(null);
              router.push('/sign-in');
            }}
            hitSlop={8}
            className="py-2 px-4 rounded-xl">
            <Text className="text-slate-400 text-xs">
              Already registered? <Text className="text-brand-400 font-bold">Sign In here</Text>
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
