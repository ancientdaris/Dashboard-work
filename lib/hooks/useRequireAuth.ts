"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook to protect routes that require authentication
 * Redirects to signin page if user is not authenticated
 */
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth check to complete
    if (!loading) {
      // If no user is logged in, redirect to signin
      if (!user) {
        router.push('/signin');
      }
    }
  }, [user, loading, router]);

  return { user, loading };
};
