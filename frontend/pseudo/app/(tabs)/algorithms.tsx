import { View, Platform, StatusBar } from "react-native"
import { Text } from "../components/ui/text"
import { SafeAreaView } from "react-native"
import { Header } from "../components/shared/Header"

export default function AlgorithmsScreen() {
  console.log('========= ALGORITHMS SCREEN IS LOADING ========');

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: statusBarHeight }}>
      <Header title="Pseudo" />
      <View className="flex-1 items-center justify-center">
        <Text className="font-montserrat text-black">Algorithms Screen</Text>
      </View>
    </SafeAreaView>
  )
} 