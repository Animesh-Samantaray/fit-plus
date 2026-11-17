import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function ProtectedLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, role, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !profile) {
        // Unauthenticated or unregistered access attempt -> redirect to sign-in
        router.replace('/sign-in');
        return;
      }

      // If user tries to open /admin without being an admin -> redirect to /dashboard
      if (pathname.includes('/admin') && role !== 'admin') {
        router.replace('/(protected)/dashboard');
      }
    }
  }, [user, profile, role, isLoading, pathname]);

  if (isLoading) {
    return <LoadingScreen message="Authenticating session..." />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <View className="flex-1 flex-row bg-navy-975 min-h-screen">
      {/* Desktop Sidebar (visible on lg screens, hidden on mobile) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Column */}
      <View className="flex-1 flex-col min-w-0">
        <AppHeader />
        <View className="flex-1 bg-navy-975">
          <Slot />
        </View>
        {/* Mobile Bottom Tab Bar (visible on mobile, hidden on lg screens) */}
        <BottomTabBar />
      </View>
    </View>
  );
}
