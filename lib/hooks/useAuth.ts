import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
const supabase = createClient();
import { User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const checkAdmin = (user: User | null): boolean => {
    if (!user) return false;
    const role = user.user_metadata?.role || user.app_metadata?.role;
    return role === 'admin';
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(checkAdmin(currentUser));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(checkAdmin(currentUser));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (data: SignInData): Promise<{ error: AuthError | null }> => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        return { error };
      }

      // Log the login activity
      const { logActivity } = await import('@/lib/activity-logger');
      await logActivity({
        action: 'login',
        metadata: {
          email: data.email.trim().toLowerCase(),
        },
      });

      router.push('/dashboard');
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { logActivity } = await import('@/lib/activity-logger');
      await logActivity({
        action: 'logout',
      });

      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      router.push('/signin');
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  return {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
    resetPassword,
  };
};
