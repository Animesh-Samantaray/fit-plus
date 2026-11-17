import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { getAllowedEmailDomain } from '@/utils/validateEmailDomain';
import { Badge } from '@/components/Badge';
import { CopyIcon, CheckIcon, ShieldCheckIcon } from '@/components/Icons';

export function UserProfile({ user, profile }) {
  const [copied, setCopied] = useState(false);

  const displayName = profile?.name || user?.displayName || 'HB+ Member';
  const email = profile?.email || user?.email || 'N/A';
  const photoURL = profile?.photoURL || user?.photoURL;
  const role = profile?.role || 'user';
  const isAdmin = role === 'admin';
  const allowedDomain = getAllowedEmailDomain();

  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'HB';

  const handleCopyUid = () => {
    if (user?.uid) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(user.uid).catch(() => {});
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View className="bg-surface-850 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/30">
      <View className="flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar with Glow Ring */}
        <View className="relative">
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-brand-500/40 shadow-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-navy-800 border-2 border-brand-400/40 items-center justify-center shadow-lg shadow-brand-500/20">
              <Text className="text-white font-black text-2xl sm:text-3xl tracking-wider">
                {initials}
              </Text>
            </View>
          )}

          {/* Active status pulse badge on avatar */}
          <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-navy-900 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-white" />
          </View>
        </View>

        {/* User Identity Info */}
        <View className="flex-1 items-center sm:items-start text-center sm:text-left">
          <View className="flex-row items-center space-x-2.5 mb-1.5 flex-wrap justify-center sm:justify-start">
            <Text className="text-white font-extrabold text-xl sm:text-2xl tracking-tight">
              {displayName}
            </Text>
            <Badge
              variant={isAdmin ? 'purple' : 'brand'}
              label={isAdmin ? 'Admin' : 'Member'}
              dot
              size="sm"
            />
          </View>

          <Text className="text-slate-400 text-sm font-medium mb-3">{email}</Text>

          {/* Verification Status Pill */}
          <View className="flex-row items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full self-center sm:self-start">
            <ShieldCheckIcon size={14} color="#34d399" />
            <Text className="text-emerald-300 font-semibold text-xs tracking-wide">
              Verified @{allowedDomain} Account
            </Text>
          </View>
        </View>
      </View>

      {/* Account Info Details Grid */}
      <View className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Account UID */}
        <View className="bg-navy-950/60 p-4 rounded-2xl border border-slate-800/80">
          <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            Account ID (UID)
          </Text>
          <View className="flex-row items-center justify-between">
            <Text
              className="text-slate-300 font-mono text-xs truncate max-w-[150px]"
              numberOfLines={1}>
              {user?.uid || 'Unknown'}
            </Text>
            <Pressable
              onPress={handleCopyUid}
              className="flex-row items-center space-x-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all">
              {copied ? (
                <>
                  <CheckIcon size={12} color="#34d399" />
                  <Text className="text-emerald-400 text-[10px] font-semibold">Copied</Text>
                </>
              ) : (
                <>
                  <CopyIcon size={12} color="#94a3b8" />
                  <Text className="text-slate-400 text-[10px] font-medium">Copy</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Access Tier */}
        <View className="bg-navy-950/60 p-4 rounded-2xl border border-slate-800/80">
          <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            Access Authorization
          </Text>
          <Text className="text-white font-bold text-sm capitalize">
            {role} Access Tier
          </Text>
          <Text className="text-slate-500 text-[11px] mt-0.5">
            {isAdmin ? 'Administrative privileges' : 'Standard member access'}
          </Text>
        </View>

        {/* Domain Enforced */}
        <View className="bg-navy-950/60 p-4 rounded-2xl border border-slate-800/80">
          <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            Domain Constraint
          </Text>
          <Text className="text-brand-300 font-bold text-sm">
            @{allowedDomain}
          </Text>
          <Text className="text-slate-500 text-[11px] mt-0.5">
            Policy enforced per session
          </Text>
        </View>
      </View>
    </View>
  );
}
