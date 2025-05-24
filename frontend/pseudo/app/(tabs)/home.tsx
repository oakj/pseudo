import { SafeAreaView, ScrollView, View, Animated, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from "react-native"
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

// This function determines if the date is completed, missed, upcoming, or current
function determineStatus(date: Date, completed: number): "completed" | "missed" | "upcoming" | "current" {
  // Create dates at midnight in local timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return "current";
  }
  
  if (compareDate > today) {
    return "upcoming";
  }
  
  return completed ? "completed" : "missed";
}

// This function maps weeklyStreak.streak_days to dayName, dayNumber and dayStatus
function calculateStreak(weeklyStreak: WeeklyStreakData): StreakDay[] {
  // Convert UTC date to local time
  const weekStartLocal = new Date(weeklyStreak.week_start_utc);
  // Adjust for timezone offset
  weekStartLocal.setMinutes(weekStartLocal.getMinutes() + weekStartLocal.getTimezoneOffset());
  weekStartLocal.setHours(0, 0, 0, 0);  // Reset to midnight
  
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStartLocal);
    date.setDate(weekStartLocal.getDate() + index);
    
    const isCompleted = weeklyStreak.streak_days?.includes(index);

    return {
      day: format(date, 'EEE').toUpperCase(),
      date: date.getDate(),
      status: determineStatus(date, isCompleted ? 1 : 0)
    };
  });
}

interface StreakDay {
  day: string
  date: number
  status: "completed" | "missed" | "upcoming" | "current"
}

interface WeeklyStreakData {
  week_start_utc: Date
  streak_days: number[]
}

export default function HomeScreen() {
  const { drawerVisible, translateY, showDrawer, hideDrawer } = useDrawer()
  const { data, loading, error } = useHomeData()
  const [showSaveDrawer, setShowSaveDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const profile = data?.profile;
  const weeklyStreak = data?.weeklyStreak;
  const collections = data?.collections;
  const questions = data?.questions;

  // On Android, we need to manually account for the status bar height
  // On iOS, SafeAreaView handles this automatically
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
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
        <StatusBar barStyle="light-content" />
        <Header />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Status Bar Configuration
          iOS: Uses barStyle to control icon colors and inherits background from SafeAreaView
          Android: Requires explicit backgroundColor and translucent settings */}
      <StatusBar 
        barStyle="dark-content"
        {...(Platform.OS === 'android' 
          ? {
              backgroundColor: "#FFFFFF",  // Set white background on Android
              translucent: true           // Make status bar translucent on Android to handle padding ourselves
            } 
          : {}
        )}
      />
      
      {/* Add padding to account for status bar on Android
          iOS handles this automatically with SafeAreaView */}
      <View style={{ paddingTop: statusBarHeight }} className="flex-1">
        <Header />
        <ScrollView>
          <View className="mt-2">
            {/* Weekly Streak Section */}
            <View className="px-4 items-center justify-center">
              <WeeklyStreak 
                streak={calculateStreak(weeklyStreak)}
                weekStart={weeklyStreak?.week_start_utc}
              />
            </View>

            {/* Collections Section */}
            <View className="mt-6">
              <View className="flex-row justify-between items-center px-4 mb-3">
                <Text className="font-montserrat-semibold text-lg text-black">Featured Collections</Text>
                <TouchableOpacity onPress={showDrawer}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#A1A1AA" />
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true}
                className="px-4"
                style={{
                  flexGrow: 0,  // Prevents the ScrollView from expanding
                  height: 58    // Gives enough room for the scrollbar (50px height + padding)
                }}
                contentContainerStyle={{
                  paddingBottom: 8  // Adds space for the scrollbar
                }}
              >
                <Collections 
                  collections={(data?.collections || []).map(collection => ({
                    id: collection.collection_id,
                    name: collection.collection_name,
                    isDefault: collection.is_default
                  }))}
                />
              </ScrollView>
            </View>

            {/* Questions Section */}
            <View className="mt-6 px-4 mb-6">
              <View className="flex-row justify-between items-center">
                <Text className="font-montserrat-semibold text-lg text-black">Featured Questions</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#A1A1AA" />
                </TouchableOpacity>
              </View>
              <QuestionsByCategory 
                type="difficulty" 
                questions={(questions || []).map(question => ({
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
          </View>
        </ScrollView>

        {/* Bottom Drawers */}
        {drawerVisible && (
          <View className="absolute inset-0 bg-gray-soft/50">
            <CollectionsBottomDrawer
              collections={collections.map(collection => ({
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
              collections={collections.map(collection => ({
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
      </View>
    </SafeAreaView>
  )
} 