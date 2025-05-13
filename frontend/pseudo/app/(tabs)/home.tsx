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

  // Calculate week range
  const weekStart = data?.weeklyStreak?.week_start || new Date()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekRange = `${format(weekStart, 'M/d')} - ${format(weekEnd, 'M/d')}`

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header />

      <ScrollView className="flex-1">
        {/* Weekly Streak Section */}
        <View className="px-4">
            <WeeklyStreak streak={data?.weeklyStreak?.streak_days || []} />
        </View>

        {/* Collections Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-2xl font-montserrat font-semibold text-black">Collections</Text>
            <TouchableOpacity onPress={showDrawer}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Collections collections={data?.collections || []} onMorePress={showDrawer} />
        </View>

        {/* Questions Section - updated to match new design */}
        <View className="mt-6 px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-montserrat font-semibold text-black">Questions</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <QuestionsByCategory 
            type="difficulty" 
            questions={data?.questions || []} 
          />
        </View>
      </ScrollView>

      {/* Collections Bottom Drawer */}
      {drawerVisible && (
        <CollectionsBottomDrawer
          collections={data?.collections || []}
          onCollectionPress={(collectionId) => {
            // Handle collection navigation
            hideDrawer()
          }}
          onClose={hideDrawer}
        />
      )}

      {/* Save Question To Collection Bottom Drawer */}
      {showSaveDrawer && selectedQuestionId && (
        <SaveQuestionToCollectionBottomDrawer
          collections={data?.collections || []}
          onCollectionPress={(collectionId) => {
            // Handle saving/removing question to/from collection
          }}
          onClose={() => {
            setShowSaveDrawer(false)
            setSelectedQuestionId(null)
          }}
        />
      )}
    </SafeAreaView>
  )
} 