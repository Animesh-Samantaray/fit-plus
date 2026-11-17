import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export function Skeleton({
  width = '100%',
  height = 20,
  rounded = 'rounded-lg',
  className = '',
  style,
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          opacity,
        },
        style,
      ]}
      className={`bg-slate-800 ${rounded} ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View className="space-y-6">
      {/* Banner Skeleton */}
      <Skeleton height={160} rounded="rounded-3xl" />

      {/* Profile Skeleton */}
      <Skeleton height={200} rounded="rounded-2xl" />

      {/* Grid Skeleton */}
      <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton height={110} rounded="rounded-2xl" />
        <Skeleton height={110} rounded="rounded-2xl" />
        <Skeleton height={110} rounded="rounded-2xl" />
        <Skeleton height={110} rounded="rounded-2xl" />
      </View>
    </View>
  );
}
