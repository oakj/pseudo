import { SafeAreaView, ScrollView, View, Animated, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { WeeklyStreak } from "../components/home/WeeklyStreak"
import { Collections } from "../components/home/Collections"
import { QuestionsByCategory } from "../components/home/QuestionsByCategory"
import { useDrawer } from "../hooks/useDrawer"
import { useHomeData } from "../hooks/useHomeData"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { CollectionsBottomDrawer } from "../components/home/CollectionsBottomDrawer"
import { SaveQuestionToCollectionBottomDrawer } from "../components/home/SaveQuestionToCollectionBottomDrawer"
import { useState, useEffect } from "react"
import { BottomSpacer } from "../components/shared/BottomSpacer"
import { SortQuestionsBottomDrawer } from "../components/home/SortQuestionsBottomDrawer"
import { useRouter } from "expo-router"
import Constants from 'expo-constants'

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
function calculateStreak(weeklyStreak: WeeklyStreakData | null): StreakDay[] {
  // Get today at midnight in local timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If no weeklyStreak data, create a week starting from today with all days as upcoming except current
  if (!weeklyStreak || !weeklyStreak.week_start_utc) {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 3 + index); // Start 3 days before today
      
      return {
        day: format(date, 'EEE').toUpperCase(),
        date: date.getDate(),
        // If it's today, mark as current, otherwise mark as upcoming
        status: date.getTime() === today.getTime() ? "current" : "upcoming"
      };
    });
  }

  // If we have weeklyStreak data, use it
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

// Add this sorting function before the HomeScreen component
function sortQuestions(questions: any[], sortType: "nameAsc" | "nameDesc" | "difficultyAsc" | "difficultyDesc") {
  const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
  
  return [...questions].sort((a, b) => {
    switch (sortType) {
      case "nameAsc":
        return a.question_title.localeCompare(b.question_title);
      case "nameDesc":
        return b.question_title.localeCompare(a.question_title);
      case "difficultyAsc":
        return difficultyOrder[a.question_difficulty.toLowerCase()] - difficultyOrder[b.question_difficulty.toLowerCase()];
      case "difficultyDesc":
        return difficultyOrder[b.question_difficulty.toLowerCase()] - difficultyOrder[a.question_difficulty.toLowerCase()];
      default:
        return 0;
    }
  });
}

export default function HomeScreen() {
  console.log('========= HOME SCREEN IS LOADING ========');

    // disable scrolling if any child drawers are open
  const handleDrawerStateChange = (isOpen: boolean) => {
    setIsAnyDrawerOpen(isOpen);
  }
  
  // Add debug logging for Supabase configuration
  useEffect(() => {
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
    
  }, []);

  const { drawerVisible, translateY, showDrawer, hideDrawer } = useDrawer()
  const { data, loading, error } = useHomeData()
  const [showSaveDrawer, setShowSaveDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [showSortDrawer, setShowSortDrawer] = useState(false)
  const [selectedSort, setSelectedSort] = useState<"nameAsc" | "nameDesc" | "difficultyAsc" | "difficultyDesc">("nameAsc")
  const [isAnyDrawerOpen, setIsAnyDrawerOpen] = useState(false)
  const router = useRouter()

  const profile = data?.profile;
  const weeklyStreak = data?.weeklyStreak;
  const collections = data?.collections;
  const questions = data?.questions;

  // On Android, we need to manually account for the status bar height
  // On iOS, SafeAreaView handles this automatically
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

  // Sort the questions before mapping them
  const sortedQuestions = questions ? sortQuestions(questions, selectedSort) : [];

  // Add detailed error logging
  useEffect(() => {
    if (error) {
      console.error('HomeScreen Error:', error);
      console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack trace available');
    }
  }, [error]);

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
        <ScrollView
          scrollEnabled={!isAnyDrawerOpen}
        >
          <View className="mt-2">
            {/* Weekly Streak Section */}
            <View className="px-4 items-center justify-center">
              <WeeklyStreak 
                streak={calculateStreak(weeklyStreak || null)}
                weekStart={weeklyStreak?.week_start_utc ?? new Date()}
              />
            </View>

            {/* Collections Section */}
            <View className="mt-6">
              <View className="flex-row justify-between items-center px-4 mb-3">
                <Text className="font-montserrat-semibold text-lg text-black">Collections</Text>
                <TouchableOpacity 
                  className="flex-row items-center gap-1 py-1 px-2 rounded-full bg-primary/10" 
                  onPress={showDrawer}
                >
                  <Text className="text-sm text-primary font-medium">See All</Text>
                  <Ionicons name="chevron-forward" size={14} color="#6366F1" />
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true}
                className="px-4"
                style={{
                  flexGrow: 0,
                  height: 45
                }}
                contentContainerStyle={{
                  paddingBottom: 8
                }}
              >
                <Collections 
                  collections={(data?.collections || []).map(collection => ({
                    id: collection.collection_id,
                    name: collection.collection_name,
                    isDefault: collection.is_default
                  }))}
                  onCollectionPress={(collectionId: string, isDefault: boolean) => {
                    router.push({
                      pathname: "/collection",
                      params: { 
                        id: collectionId,
                        isDefault: isDefault
                      }
                    })
                  }}
                />
              </ScrollView>
            </View>

            {/* Questions Section */}
            <View className="mt-6 px-4 mb-6">
              <View className="flex-row justify-between items-center">
                <Text className="font-montserrat-semibold text-lg text-black">Questions</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    className="flex-row items-center gap-1 py-1 px-2 rounded-full bg-primary/10"
                    onPress={() => setShowSortDrawer(true)}
                  >
                    <Text className="text-sm text-primary font-medium">Sort</Text>
                    <Ionicons name="chevron-forward" size={14} color="#6366F1" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-row items-center gap-1 py-1 px-2 rounded-full bg-primary/10"
                    onPress={() => router.push("/questions")}
                  >
                    <Text className="text-sm text-primary font-medium">See All</Text>
                    <Ionicons name="chevron-forward" size={14} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              </View>
              <QuestionsByCategory 
                type="difficulty" 
                questions={(sortedQuestions || []).map(question => ({
                  id: question.question_id,
                  title: question.question_title,
                  difficulty: question.question_difficulty.toLowerCase(),
                  isSolved: question.is_solved || false,
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
                isDefault: collection.is_default,
              })) || []}
              onCollectionPress={(collectionId: string, isDefault: boolean) => {
                hideDrawer()
                router.push({
                  pathname: "/collection",
                  params: { 
                    id: collectionId,
                    isDefault: isDefault
                  }
                })
              }}
              onClose={hideDrawer}
              onDrawerStateChange={handleDrawerStateChange}
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
              onDrawerStateChange={handleDrawerStateChange}
            />
          </View>
        )}

        {/* Add Sort Bottom Drawer */}
        {showSortDrawer && (
          <View className="absolute inset-0 bg-gray-soft/50">
            <SortQuestionsBottomDrawer
              selectedSort={selectedSort}
              onSortChange={(value) => {
                setSelectedSort(value)
                setShowSortDrawer(false)
                // TODO: Implement actual sorting logic
              }}
              onClose={() => setShowSortDrawer(false)}
            />
          </View>
        )}
      </View>
      <BottomSpacer />
    </SafeAreaView>
  )
} 
