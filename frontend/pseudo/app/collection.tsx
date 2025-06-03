import { View, SafeAreaView, Platform, StatusBar, ActivityIndicator } from "react-native"
import { Text } from "./components/ui/text"
import { Header } from "./components/shared/Header"
import { useLocalSearchParams } from "expo-router"
import { collectionScreen } from "../supabase"
import { useEffect, useState } from "react"

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

export default function CollectionScreen() {
  console.log('========= COLLECTION SCREEN IS LOADING ========');

  const params = useLocalSearchParams()
  const { id, isDefault } = params
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collectionData, setCollectionData] = useState<CollectionQuestion[] | null>(null)
  
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

  useEffect(() => {
    async function fetchCollection() {
      if (!id) {
        setError("Collection ID not found")
        setLoading(false)
        return
      }

      try {
        const isDefaultBool = isDefault === 'true'
        const { data, error } = await collectionScreen.getCollectionById(id as string, isDefaultBool)
        if (error) throw error
        
        setCollectionData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load collection")
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [id, isDefault])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar 
        barStyle="dark-content"
        {...(Platform.OS === 'android' 
          ? {
              backgroundColor: "#FFFFFF",
              translucent: true
            } 
          : {}
        )}
      />
      
      <View style={{ paddingTop: statusBarHeight }} className="flex-1">
        <Header showBackButton title="Pseudo" />
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : (
          <View className="flex-1 p-4">
            <View className="items-center mb-8">
              <Text className="font-montserrat-semibold text-2xl text-center">
                {collectionData?.[0]?.collection?.collection_name}
              </Text>
              <Text className="font-montserrat-medium text-gray-600 mt-2 text-center">
                {collectionData?.[0]?.questions?.filter(q => q.solved).length ?? 0} solved of {collectionData?.[0]?.questions?.length ?? 0} questions
              </Text>
            </View>
            
            {collectionData?.[0]?.questions?.map((question) => (
              <View 
                key={question.question_id} 
                className="bg-gray-50 p-4 rounded-lg mb-2"
              >
                <Text className="font-montserrat-medium">
                  {question.question_title}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Difficulty: {question.difficulty}
                </Text>
                {question.solved && (
                  <Text className="text-green-500 text-sm mt-1">
                    Solved ✓
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
