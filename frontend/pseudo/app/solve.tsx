import { View, SafeAreaView, Platform, StatusBar } from "react-native"
import { Text } from "./components/ui/text"
import { Header } from "./components/shared/Header"

export default function SolveScreen() {
  console.log('========= SOLVE SCREEN IS LOADING ========');

  // On Android, we need to manually account for the status bar height
  // On iOS, SafeAreaView handles this automatically
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

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
        <Text className="font-montserrat text-black">Solve Screen</Text>
      </View>
    </SafeAreaView>
  )
}
