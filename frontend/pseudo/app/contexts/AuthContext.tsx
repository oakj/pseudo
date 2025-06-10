import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  loginWithApple: () => Promise<{ error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This hook can be used to access the user info.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!segments[0]) return;

    if (!isAuthenticated && segments[0] !== '(auth)') {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (isAuthenticated && segments[0] === '(auth)') {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useProtectedRoute(state.isAuthenticated);

  useEffect(() => {
    // Check if there's an active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error.message);
      }
      
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }));
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    login: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    loginWithGoogle: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'yourapp://login-callback',
          }
        });
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    loginWithApple: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: 'yourapp://login-callback',
          }
        });
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    logout: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    resetPassword: async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        return { error: error ? new Error(error.message) : null };
      } catch (error) {
        return { error: error as Error };
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
} 