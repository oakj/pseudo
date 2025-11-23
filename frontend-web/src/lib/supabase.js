import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Auth functions
export const auth = {
  // Email/password signup
  async signUpWithEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Email/password login
  async signInWithEmail(email, password) {
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
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    return { data, error }
  },

  // Apple OAuth login
  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
}

/* Data fetching functions */

export const userData = {
  // Profile functions
  async getProfileByUserId() {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { data: null, error: authError }

    const { data, error } = await supabase
      .rpc('selectprofilebyuserid', {
        p_user_id: user.id
      })
    return { data, error }
  },
  
  // HomeScreen functions
  async getStreakByUserId() {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { data: null, error: authError }

    const { data, error } = await supabase
      .rpc('selectweeklystreakbyuserid', {
        p_user_id: user.id
      })
    return { data, error }
  },

  async getCollectionsByUserId() {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { data: null, error: authError }

    const { data, error } = await supabase
      .rpc('selectcollectionsbyuserid', {
        p_user_id: user.id
      })
    return { data, error }
  },

  async getQuestionsByUserId() {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { data: null, error: authError }

    const { data, error } = await supabase
      .rpc('selectquestionsbyuserid', {
        p_user_id: user.id
      })
    return { data, error }
  }
}

// SolveScreen functions
export const solveScreen = {
  async getQuestionData(questionId) {
    try {
      // Download the file directly using Supabase storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('questions')
        .download(`${questionId}.json`)

      if (downloadError) {
        console.error('Error downloading file:', downloadError)
        throw downloadError
      }

      if (!fileData) {
        throw new Error('No file data received')
      }

      // Handle the blob data
      if (fileData instanceof Blob) {
        const text = await new Response(fileData).text()
        
        try {
          const questionData = JSON.parse(text)
          return { data: questionData, error: null }
        } catch (parseError) {
          console.error('JSON Parse error:', parseError)
          throw parseError
        }
      } else {
        throw new Error('Downloaded file data is not in the expected Blob format')
      }
    } catch (error) {
      console.error('Error in getQuestionData:', error)
      return { data: null, error }
    }
  },

  async getUserQuestion(questionId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return { data: null, error: authError }

      const { data, error } = await supabase
        .rpc('selectuserquestion', {
          p_user_id: user.id,
          p_question_id: questionId
        })

      if (error) throw error
      
      // Return the first result since we expect only one
      return { data: data?.[0] || null, error: null }
    } catch (error) {
      console.error('Error fetching user question:', error)
      return { data: null, error }
    }
  },

  async createUserQuestion(questionId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return { data: null, error: authError }

      // First, insert the record into user_question table
      const { data, error } = await supabase
        .from('user_question')
        .insert({
          user_id: user.id,
          question_id: questionId,
          solved: false
        })
        .select()
        .single()

      if (error) throw error

      // Create initial user question data
      const initialData = {
        user_id: user.id,
        question_id: questionId,
        submission: {
          solution: {
            lines: []
          },
          timestamp: new Date().toISOString()
        },
        hint_chat: {
          messages: []
        }
      }

      // Upload the JSON file to userquestions bucket with user-specific path
      const { error: uploadError } = await supabase
        .storage
        .from('userquestions')
        .upload(`${user.id}/${data.id}.json`, JSON.stringify(initialData), {
          upsert: true
        })

      if (uploadError) throw uploadError

      return { data, error: null }
    } catch (error) {
      console.error('Error creating user question:', error)
      return { data: null, error }
    }
  },

  async getUserQuestionData(userQuestionId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Auth error or no user:', authError)
        return { data: null, error: authError }
      }

      // Try to download the file directly
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('userquestions')
        .download(`${user.id}/${userQuestionId}.json`)

      // If file doesn't exist or there's an error, create a new one
      if (downloadError || !fileData) {
        // Create initial data structure
        const initialData = {
          user_id: user.id,
          question_id: '',
          submission: {
            solution: {
              lines: []
            },
            timestamp: new Date().toISOString()
          },
          hint_chat: {
            messages: []
          }
        }

        // Upload the initial data with user-specific path
        const { error: uploadError } = await supabase
          .storage
          .from('userquestions')
          .upload(`${user.id}/${userQuestionId}.json`, JSON.stringify(initialData), {
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading new file:', uploadError)
          throw uploadError
        }
        
        return { data: initialData, error: null }
      }

      // Handle the blob data
      if (fileData instanceof Blob) {
        const text = await new Response(fileData).text()
        const data = JSON.parse(text)
        
        return { data, error: null }
      } else {
        throw new Error('Downloaded file data is not in the expected Blob format')
      }
    } catch (error) {
      console.error('Error in getUserQuestionData:', error)
      return { data: null, error }
    }
  },

  async updateUserQuestionFile(userQuestionId, data) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return { error: authError }

      const { error } = await supabase
        .storage
        .from('userquestions')
        .update(`${user.id}/${userQuestionId}.json`, JSON.stringify(data), {
          upsert: true
        })

      return { error }
    } catch (error) {
      console.error('Error updating user question file:', error)
      return { error }
    }
  }
}

// CollectionScreen functions
export const collectionScreen = {
  async getCollectionById(collectionId, isDefault = false) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { data: null, error: authError }

    const { data, error } = await supabase.rpc(
      isDefault ? 'selectdefaultcollectionbyuserid' : 'selectcollectionbyuserid',
      {
        p_user_id: user.id,
        p_collection_id: collectionId
      }
    )

    if (error) return { data: null, error }
    if (!data || data.length === 0) return { data: null, error: null }

    // Group questions by collection
    const mappedData = {
      user: {
        user_id: user.id
      },
      collection: {
        collection_id: data[0].collection_id,
        collection_name: data[0].collection_name
      },
      questions: data.map((row) => ({
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
