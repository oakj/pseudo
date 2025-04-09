import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL
const supabaseAnonKey = YOUR_REACT_NATIVE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const auth = {
    // Email/password signup
    async signUpWithEmail(email: string, password: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    },
  
    // Email/password login
    async signInWithEmail(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    },
  
    // Google OAuth login
    async signInWithGoogle() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // provided by Supabase. We should move this to an appsetting
          redirectTo: 'https://cckbpwyszkroclxnrsag.supabase.co/auth/v1/callback',
        }
      })
      return { data, error }
    },
  
    // Apple OAuth login
    async signInWithApple() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'yourapp://login-callback',
        }
      })
      return { data, error }
    },
  
    // Sign out
    async signOut() {
      const { error } = await supabase.auth.signOut()
      return { error }
    }
  }