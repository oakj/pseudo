import { View } from "react-native"
import { Text } from "../components/ui/text"
import { SafeAreaView } from "react-native"

export default function FlashcardsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="font-montserrat text-black">Flashcards Screen</Text>
      </View>
    </SafeAreaView>
  )
} 