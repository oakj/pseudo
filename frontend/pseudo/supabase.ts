import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? ''
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? ''
const testUserId = Constants.expoConfig?.extra?.supabaseTestUserId

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Auth functions

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

/* Below functions are temporary. They are intended to be used to fetch test data from supabase. */

export const testData = {
  // TEST: Profile functions
  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('selectprofilebyuserid', {
        p_user_id: testUserId // temporarily hard coding a testUserId
      })
    return { data, error }
  },
  
  // TEST: HomeScreen functions
  async getStreakByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('selectweeklystreakbyuserid', {
        p_user_id: testUserId // temporarily hard coding a testUserId
      })
    return { data, error }
  },

  // leaving userId as null will return only default collections
  async getCollectionsByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('selectcollectionsbyuserid', {
        p_user_id: testUserId // temporarily hard coding a testUserId
      })
    return { data, error }
  },

  async getQuestionsByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('selectquestionsbyuserid', {
        p_user_id: testUserId // temporarily hard coding a testUserId
      })
    return { data, error }
  }
}

// TEST: CollectionScreen functions

// TEST: SolveScreen functions