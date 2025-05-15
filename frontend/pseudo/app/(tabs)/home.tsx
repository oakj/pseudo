import { SafeAreaView, ScrollView, View, Animated, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { WeeklyStreak } from "../components/home/WeeklyStreak"
import { Collections } from "../components/home/Collections"
import { QuestionsByCategory } from "../components/home/QuestionsByCategory"
import { MoreCollections } from "../components/home/MoreCollections"
import { useDrawer } from "../hooks/useDrawer"
import { useHomeData } from "../hooks/useHomeData"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { ScrollView as RNScrollView } from "react-native"
import { CollectionsBottomDrawer } from "../components/home/CollectionsBottomDrawer"
import { SaveQuestionToCollectionBottomDrawer } from "../components/home/SaveQuestionToCollectionBottomDrawer"
import { useState } from "react"

function determineStatus(date: Date, completed: number): "completed" | "missed" | "upcoming" | "current" {
  const today = new Date();
  
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "current";
  }
  
  if (date > today) {
    return "upcoming";
  }
  
  return completed ? "completed" : "missed";
}

export default function HomeScreen() {
  const { drawerVisible, translateY, showDrawer, hideDrawer } = useDrawer()
  const { data, loading, error } = useHomeData()
  const [showSaveDrawer, setShowSaveDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  // console.log homedata for debugging
  // console.log('========= HOME DATA ========', data)

  // Calculate week range
  const weekStart = data?.weeklyStreak?.week_start || new Date()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const weekRange = `${format(weekStart, 'M/d')} - ${format(weekEnd, 'M/d')}`

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1">
        {/* Weekly Streak Section */}
        <View className="px-4">
          <Text className="text-lg font-montserrat font-semibold text-black mb-3">Weekly Streak</Text>
          <View className="w-[340] h-[130]">
            <WeeklyStreak 
              streak={data?.weeklyStreak?.streak_days.map((day, index) => {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + index);
                
                return {
                  day: format(date, 'EEE').toUpperCase(),
                  date: date.getDate(),
                  status: determineStatus(date, day)
                };
              }) || []}
            />
          </View>
        </View>

        {/* Collections Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-lg font-montserrat font-semibold text-black">Collections</Text>
            <TouchableOpacity onPress={showDrawer}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#E7E7E7" />
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            <Collections 
              collections={(data?.collections || []).map(collection => ({
                id: collection.collection_id,
                name: collection.collection_name,
                isDefault: collection.is_default
              }))}
              onMorePress={showDrawer}
            />
          </ScrollView>
        </View>

        {/* Questions Section */}
        <View className="mt-6 px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-montserrat font-semibold text-black">Questions</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#E7E7E7" />
            </TouchableOpacity>
          </View>
          <QuestionsByCategory 
            type="difficulty" 
            questions={(data?.questions || []).map(question => ({
              id: question.question_id,
              title: question.question_title,
              difficulty: question.question_difficulty.toLowerCase(),
              isSolved: question.is_solved || false,
              leetcodeId: question.question_leetcode_id
            }))}
            onBookmarkPress={(questionId: string) => {
              setSelectedQuestionId(questionId)
              setShowSaveDrawer(true)
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Drawers */}
      {drawerVisible && (
        <View className="absolute inset-0 bg-gray-soft/50">
          <CollectionsBottomDrawer
            collections={data?.collections.map(collection => ({
              id: collection.collection_id,
              name: collection.collection_name,
              isDefault: collection.is_default
            })) || []}
            onCollectionPress={(collectionId: string) => {
              hideDrawer()
            }}
            onClose={hideDrawer}
          />
        </View>
      )}

      {showSaveDrawer && selectedQuestionId && (
        <View className="absolute inset-0 bg-gray-soft/50">
          <SaveQuestionToCollectionBottomDrawer
            collections={data?.collections.map(collection => ({
              id: collection.collection_id,
              name: collection.collection_name,
              isDefault: collection.is_default
            })) || []}
            onCollectionPress={(collectionId: string) => {
              // Handle saving/removing question to/from collection
            }}
            onClose={() => {
              setShowSaveDrawer(false)
              setSelectedQuestionId(null)
            }}
          />
        </View>
      )}
    </SafeAreaView>
  )
} 