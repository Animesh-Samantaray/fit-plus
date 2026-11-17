import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';

/**
 * Backwards compatibility redirect:
 * Routes /login to /sign-in
 */
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return <LoadingScreen message="Redirecting to Sign In..." />;
}
