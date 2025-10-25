"use client";

import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Component wrapper for protected routes
 * Shows loading state while checking authentication
 * Redirects to signin if not authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useRequireAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // Return null while redirecting (useRequireAuth handles the redirect)
  return null;
}
