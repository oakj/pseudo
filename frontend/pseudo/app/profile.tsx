import { SafeAreaView, View, ScrollView, Pressable, Platform, StatusBar, TouchableOpacity } from "react-native"
import { Text } from "./components/ui/text"
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
import { Button } from "./components/ui/button"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Palette } from "./lib/icons/Palette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Input } from "./components/ui/input"
import { Bug } from "./lib/icons/Bug"
import { Separator } from "./components/ui/separator"
import { ArrowLeft } from "./lib/icons/ArrowLeft"
import { useAvatar, DEFAULT_AVATARS } from "./contexts/AvatarContext"
import { Pencil } from "./lib/icons/Pencil"

type ThemeOption = "light" | "dark" | "system"

export default function ProfileScreen() {
  console.log('========= PROFILE SCREEN IS LOADING ========');

  const router = useRouter()
  const { selectedAvatar, setSelectedAvatar } = useAvatar()
  const [theme, setTheme] = useState<ThemeOption>("system")
  const [displayName, setDisplayName] = useState("oonniejak")
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

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
        {/* New Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center mb-6 relative">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="z-10"
            >
              <ArrowLeft size={24} className="text-black" />
            </TouchableOpacity>
            <View className="absolute w-full items-center">
              <Text className="text-lg font-montserrat-semibold">Profile & Settings</Text>
            </View>
          </View>
          
          <View className="items-center">
            <Pressable onPress={() => setIsAvatarSheetOpen(true)}>
              <Avatar className="w-20 h-20 mb-2">
                <AvatarImage source={selectedAvatar.url} />
                <AvatarFallback>
                  <Text>{selectedAvatar.id}</Text>
                </AvatarFallback>
              </Avatar>
            </Pressable>
            
            {isEditingName ? (
              <View className="flex-row items-center gap-2 mb-1">
                <Input 
                  className="h-[25px] w-[150px] justify-start px-2 leading-[12px] text-black font-montserrat-medium border-[1px] border-gray-300 rounded-[4px]"
                  style={{
                    fontSize: 14,
                    height: 25,
                    padding: 0,
                    paddingHorizontal: 8,
                    borderRadius: 4,
                  }}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                />
              </View>
            ) : (
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-montserrat-semibold">{displayName}</Text>
                <Pressable onPress={() => setIsEditingName(true)}>
                  <Pencil size={16} className="text-gray-500" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <ScrollView className="flex-1 px-4">
          {/* Testing Link */}
          <View className="flex-row items-center mb-4">
            <Pressable 
              onPress={() => router.push("/debug")}
              className="flex-row items-center gap-3"
            >
              <Bug size={24} className="text-black" />
              <Text className="text-[10px] text-black font-montserrat">Debug Screen</Text>
            </Pressable>
          </View>

          {/* Theme Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <Palette size={24} className="text-black" />
              <Text className="text-[10px] text-black font-montserrat">Theme</Text>
            </View>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchableOpacity>
                  <View 
                    className="h-[25px] w-[150px] justify-center px-2 border-[1px] border-gray-300 rounded-[4px] bg-white"
                  >
                    <Text className="text-[10px] text-black font-montserrat">
                      {theme}
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
                  <Text style={{ fontSize: 10 }} className="text-black font-montserrat">system</Text>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  className="px-2 py-2 active:bg-gray-100"
                  onPress={() => setTheme("light")}
                >
                  <Text style={{ fontSize: 10 }} className="text-black font-montserrat">light</Text>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem 
                  className="px-2 py-2 active:bg-gray-100"
                  onPress={() => setTheme("dark")}
                >
                  <Text style={{ fontSize: 10 }} className="text-black font-montserrat">dark</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-8 py-8">
          <View className="flex-row justify-between">
            <Button 
              className="w-[40%] bg-red-soft rounded-[8px]"
              onPress={handleLogout}
            >
              <Text className="text-base text-black font-montserrat">Logout</Text>
            </Button>
            <Button 
              className="w-[40%] bg-gray-100 rounded-[8px]"
            >
              <Text className="text-base text-black font-montserrat">Save</Text>
            </Button>
          </View>
        </View>
      </View>

      {/* Avatar Bottom Sheet */}
      {isAvatarSheetOpen && (
        <View className="absolute inset-0 bg-gray-soft/50">
          <Pressable 
            className="flex-1"
            onPress={() => setIsAvatarSheetOpen(false)}
          />
          <View className="bg-white rounded-t-[20px] p-6">
            <View className="items-center mb-6">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-lg font-montserrat-semibold mb-4 text-center">Choose Avatar</Text>
            
            <View className="flex-row flex-wrap gap-4 justify-center">
              {DEFAULT_AVATARS.map((avatar) => (
                <Pressable
                  key={avatar.id}
                  onPress={() => setSelectedAvatar(avatar)}
                >
                  <Avatar
                    className={`w-16 h-16 ${
                      selectedAvatar.id === avatar.id ? "border-2 border-primary" : ""
                    }`}
                  >
                    <AvatarImage source={avatar.url} />
                    <AvatarFallback>
                      <Text>{avatar.id}</Text>
                    </AvatarFallback>
                  </Avatar>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
