import { SafeAreaView, ScrollView, View, Animated, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { WeeklyStreak } from "../components/home/WeeklyStreak"
import { Collections } from "../components/home/Collections"
import { QuestionsByCategory } from "../components/home/QuestionsByCategory"
import { MoreCollections } from "../components/home/MoreCollections"
import { useDrawer } from "../hooks/useDrawer"
import { useHomeData } from "../hooks/useHomeData"

export default function HomeScreen() {
  const { drawerVisible, translateY, showDrawer, hideDrawer } = useDrawer()
  const { data, loading, error } = useHomeData()

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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header />

      <ScrollView className="flex-1 px-4">
        <WeeklyStreak streak={data?.weeklyStreak?.streak_days || []} />

        <Text className="text-lg font-semibold mt-6 mb-3 text-gray-800">Collections</Text>
        <Collections 
          collections={data?.collections || []} 
          onMorePress={showDrawer} 
        />

        <Text className="text-lg font-semibold mt-6 mb-3 text-gray-800">Questions by difficulty</Text>
        <QuestionsByCategory 
          type="difficulty" 
          questions={data?.questions || []} 
        />

        <Text className="text-lg font-semibold mt-6 mb-3 text-gray-800">by design pattern</Text>
        <QuestionsByCategory 
          type="pattern" 
          questions={data?.questions || []} 
        />
      </ScrollView>

      {/* Bottom Drawer */}
      {drawerVisible && (
        <View className="absolute inset-0 z-50">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50" 
            onPress={hideDrawer} 
          />
          <Animated.View 
            className="bg-white rounded-t-3xl pt-3 pb-6 px-4"
            style={{ transform: [{ translateY }] }}
          >
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />
            <Text className="text-xl font-semibold text-center mb-4 text-gray-800">
              More Collections
            </Text>
            <ScrollView className="flex-1">
              <MoreCollections collections={data?.collections || []} />
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  )
} 