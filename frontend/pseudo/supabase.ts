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
interface UserQuestion {
  id: string;
  user_id: string;
  question_id: string;
  solved: boolean;
  blob_url: string | null;
}

interface HintMessage {
  from: 'user' | 'hint_bot';
  message: string;
  timestamp: string;
}

interface UserQuestionData {
  user_id: string;
  question_id: string;
  submission?: {
    solution: string;
    timestamp: string;
    evaluation?: any;
  };
  hint_chat: {
    messages: HintMessage[];
  };
}

export const solveScreen = {
    async getQuestionData(questionId: string) {
        try {
            // First get the public URL for the file
            const { data: publicURL } = supabase
                .storage
                .from('questions')
                .getPublicUrl(`${questionId}.json`);

            // Fetch the file using the public URL
            const response = await fetch(publicURL.publicUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const questionData = await response.json();
            return { data: questionData, error: null };

        } catch (error) {
            console.error('Error fetching question data:', error);
            return { data: null, error };
        }
    },

    async getUserQuestion(userId: string, questionId: string): Promise<{ data: UserQuestion | null, error: any }> {
        try {
            const { data, error } = await supabase
                .rpc('selectuserquestion', {
                    p_user_id: userId,
                    p_question_id: questionId
                });

            if (error) throw error;
            
            // Return the first result since we expect only one
            return { data: data?.[0] || null, error: null };
        } catch (error) {
            console.error('Error fetching user question:', error);
            return { data: null, error };
        }
    },

    async createUserQuestion(userId: string, questionId: string): Promise<{ data: UserQuestion | null, error: any }> {
        try {
            // First, insert the record into user_question table
            const { data, error } = await supabase
                .from('user_question')
                .insert({
                    user_id: userId,
                    question_id: questionId,
                    solved: false
                })
                .select()
                .single();

            if (error) throw error;

            // Create initial user question data
            const initialData: UserQuestionData = {
                user_id: userId,
                question_id: questionId,
                hint_chat: {
                    messages: []
                }
            };

            // Upload the JSON file to userquestions bucket
            const { error: uploadError } = await supabase
                .storage
                .from('userquestions')
                .upload(`${data.id}.json`, JSON.stringify(initialData));

            if (uploadError) throw uploadError;

            return { data, error: null };
        } catch (error) {
            console.error('Error creating user question:', error);
            return { data: null, error };
        }
    },

    async getUserQuestionData(userQuestionId: string): Promise<{ data: UserQuestionData | null, error: any }> {
        try {
            // Get the public URL for the file from userquestions bucket
            const { data: publicURL } = supabase
                .storage
                .from('userquestions')
                .getPublicUrl(`${userQuestionId}.json`);

            const response = await fetch(publicURL.publicUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching user question data:', error);
            return { data: null, error };
        }
    }
}

// TEST: QuestionsScreen functions

interface CollectionQuestion {
  user: {
    user_id: string
  },
  collection: {
    collection_id: string
    collection_name: string
  },
  questions: [
    {
      question_id: string
      question_title: string
      solved: boolean,
      blob_url: string,
      difficulty: string,
      design_patterns: string[]
    }
  ]
}

interface DatabaseResponse {
  collection_id: string
  collection_name: string
  question_id: string
  question_title: string
  solved: boolean
  blob_url: string
  difficulty: string
  design_patterns: string[]
}

// temporarily hard coding a userId for testing purposes. change to `user.id` for final function
export const collectionScreen = {
  async getCollectionById(collectionId: string, isDefault: boolean = false): Promise<{ 
    data: CollectionQuestion[] | null, 
    error: any 
  }> {
    const { data, error } = await supabase.rpc(
      isDefault ? 'selectdefaultcollectionbyuserid' : 'selectcollectionbyuserid',
      {
        p_user_id: testUserId,
        p_collection_id: collectionId
      }
    )

    if (error) return { data: null, error }
    if (!data || data.length === 0) return { data: null, error: null }

    // Group questions by collection
    const mappedData: CollectionQuestion = {
      user: {
        user_id: testUserId
      },
      collection: {
        collection_id: data[0].collection_id,
        collection_name: data[0].collection_name
      },
      questions: data.map(row => ({
        question_id: row.question_id,
        question_title: row.question_title,
        solved: row.solved,
        blob_url: row.blob_url,
        difficulty: row.difficulty,
        design_patterns: row.design_patterns || []
      }))
    }

    return { data: [mappedData], error: null }
  }
}