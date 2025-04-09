import { SafeAreaView, View, ScrollView, Pressable } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import { useRouter } from "expo-router"
import { useState } from "react"

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

type DarkModeOption = "light" | "dark" | "system"

const DARK_MODE_OPTIONS = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "System" },
]

export default function ProfileScreen() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0])
  const [darkMode, setDarkMode] = useState<DarkModeOption>("system")

  const handleLogout = async () => {
    // TODO: Implement logout logic
    router.replace("/(auth)/login")
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header />
      
      <ScrollView className="flex-1 px-4 py-6">
        {/* Avatar Selection */}
        <Text className="text-lg font-semibold mb-3">Change Avatar</Text>
        <Separator className="mb-4" />
        <View className="flex-row flex-wrap gap-4 mb-8">
          {DEFAULT_AVATARS.map((avatar) => {
            return (
              <Pressable key={avatar.id} onPress={() => setSelectedAvatar(avatar)}>
                <Avatar 
                  alt={`Avatar option ${avatar.id}`}
                  className={`w-16 h-16 ${selectedAvatar.id === avatar.id ? "border-2 border-primary" : ""}`}
                >
                  <AvatarImage 
                    source={avatar.url} 
                    className="w-full h-full"
                  />
                  <AvatarFallback>
                    <Text>{avatar.id}</Text>
                  </AvatarFallback>
                </Avatar>
              </Pressable>
            )
          })}
        </View>

        {/* Dark Mode Selection */}
        <Text className="text-lg font-semibold mb-3">Dark Mode</Text>
        <Separator className="mb-4" />
        <Select
          value={{ value: darkMode, label: DARK_MODE_OPTIONS.find(opt => opt.value === darkMode)?.label }}
          onValueChange={(option) => setDarkMode(option.value as DarkModeOption)}
        >
          <SelectTrigger className="w-full mb-8">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {DARK_MODE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Logout Button */}
        <Button 
          variant="destructive"
          className="mt-auto"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">LOGOUT</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}
