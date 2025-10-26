import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
const supabase = createClient();
import { User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { sanitizeInput } from '@/lib/validation';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  businessType: 'retailer' | 'wholesaler';
  businessName?: string;
  gstNumber?: string;
  city?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData): Promise<{ error: AuthError | null }> => {
    try {
      // Sanitize all user metadata before sending to Supabase
      // Email and password are already validated/sanitized in the form
      const { error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: sanitizeInput(data.fullName),
            mobile_number: sanitizeInput(data.mobileNumber),
            business_type: data.businessType,
            business_name: data.businessName ? sanitizeInput(data.businessName) : undefined,
            gst_number: data.gstNumber ? sanitizeInput(data.gstNumber) : undefined,
            city: data.city ? sanitizeInput(data.city) : undefined,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Log the signup activity
      const { logActivity } = await import('@/lib/activity-logger');
      await logActivity({
        action: 'signup',
        metadata: {
          email: data.email.trim().toLowerCase(),
          business_type: data.businessType,
        },
      });

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (data: SignInData): Promise<{ error: AuthError | null }> => {
    try {
      // Email is already validated/sanitized in the form
      const { error } = await supabase.auth.signInWithPassword({
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

      // Redirect to dashboard after successful sign in
      router.push('/dashboard');
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      // Log the logout activity before signing out
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
      // Sanitize email input
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
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
