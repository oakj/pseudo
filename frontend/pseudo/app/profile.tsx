import { SafeAreaView, View, ScrollView, Pressable, Platform, StatusBar, TouchableOpacity } from "react-native"
import { Text } from "./components/ui/text"
import { Header } from "./components/shared/Header"
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
import { Button } from "./components/ui/button"
import { useRouter } from "expo-router"
import { useState } from "react"
import { UserRoundPen } from "./lib/icons/UserRoundPen"
import { Palette } from "./lib/icons/Palette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Input } from "./components/ui/input"
import { IdCard } from "./lib/icons/IdCard"
import { Bug } from "./lib/icons/Bug"
import { Separator } from "./components/ui/separator"

const DEFAULT_AVATARS = [
  { id: "1", url: require("../assets/avatars/1.png") },
  { id: "2", url: require("../assets/avatars/2.png") },
  { id: "3", url: require("../assets/avatars/3.png") },
  { id: "4", url: require("../assets/avatars/4.png") },
  { id: "5", url: require("../assets/avatars/5.png") },
  { id: "6", url: require("../assets/avatars/6.png") },
  { id: "7", url: require("../assets/avatars/7.png") },
  { id: "8", url: require("../assets/avatars/8.png") },
]

type ThemeOption = "light" | "dark" | "system"

export default function ProfileScreen() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0])
  const [theme, setTheme] = useState<ThemeOption>("system")
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

  const handleLogout = async () => {
    // TODO: Implement logout logic
    router.replace("/(auth)/login")
  }

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
        <Header />
        
        <ScrollView className="flex-1 px-4 py-6">
          {/* Testing Link */}
          <View className="flex-row items-center mb-4">
            <Pressable 
              onPress={() => router.push("/testing")}
              className="flex-row items-center gap-3"
            >
              <Bug size={24} className="text-black" />
              <Text className="text-xs text-muted-foreground">Debug Screen</Text>
            </Pressable>
          </View>

          {/* Display Name Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <IdCard size={24} className="text-black" />
              <Text className="text-xs text-muted-foreground">Display Name</Text>
            </View>
            <Input 
              className="h-[25px] w-[150px] justify-start px-2 leading-[12px] text-black font-montserrat-medium border-[1px] border-gray-300 rounded-[4px]"
              style={{
                fontSize: 10,
                height: 25,
                padding: 0,
                paddingHorizontal: 8,
                borderRadius: 4,
              }}
              placeholder="Enter display name"
              defaultValue="oonniiejak"
            />
          </View>

          {/* Avatar Section */}
          <View className="mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <UserRoundPen size={24} className="text-black" />
              <Text className="text-xs text-muted-foreground">Avatar</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {DEFAULT_AVATARS.map((avatar) => (
                <Avatar
                  key={avatar.id}
                  className={`w-12 h-12 ${
                    selectedAvatar.id === avatar.id ? "border-2 border-primary" : ""
                  }`}
                  onPress={() => setSelectedAvatar(avatar)}
                >
                  <AvatarImage source={avatar.url} />
                  <AvatarFallback>
                    <Text>{avatar.id}</Text>
                  </AvatarFallback>
                </Avatar>
              ))}
            </View>
          </View>

          {/* Theme Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <Palette size={24} className="text-black" />
              <Text className="text-xs text-muted-foreground">Theme</Text>
            </View>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchableOpacity>
                  <View 
                    className="h-[25px] w-[150px] justify-center px-2 border-[1px] border-gray-300 rounded-[4px] bg-white"
                  >
                    <Text className="text-[12px] text-black font-montserrat-medium">
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="bg-white border-[1px] border-gray-300 rounded-[4px] min-w-[150px]"
              >
                <DropdownMenuItem 
                  className="px-2 py-2 active:bg-gray-100"
                  onPress={() => setTheme("system")}
                >
                  <Text className="text-xs text-black font-montserrat">system</Text>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  className="px-2 py-2 active:bg-gray-100"
                  onPress={() => setTheme("light")}
                >
                  <Text className="text-xs text-black font-montserrat">light</Text>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  className="px-2 py-2 active:bg-gray-100 text-xxs"
                  onPress={() => setTheme("dark")}
                >
                  <Text className="text-xs text-red-soft font-montserrat">dark</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4">
            <Button 
              className="flex-1 bg-red-soft"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold">Logout</Text>
            </Button>
            <Button 
              className="flex-1 bg-gray-100"
            >
              <Text className="font-semibold">Save</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
