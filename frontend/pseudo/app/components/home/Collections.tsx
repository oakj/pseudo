import { View, Pressable } from "react-native"
import { Card } from '../ui/card'
import { Text } from '../ui/text'
import { Ionicons } from "@expo/vector-icons"
import { cn } from "~/app/lib/utils"

// Define valid icon types to fix the type error
type CollectionType = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function Collections({ onMorePress }: { onMorePress: () => void }) {
  const collections: CollectionType[] = [
    { name: "Search", icon: "search" },
    { name: "Google", icon: "logo-google" },
    { name: "Bloomberg", icon: "business" },
    { name: "Custom Group 1", icon: "folder" },
  ]

  return (
    <View className="flex-row flex-wrap justify-between gap-3">
      {collections.map((collection, index) => (
        <Card key={index} className="w-[48%] p-4 items-center justify-center bg-white shadow-soft">
          <Ionicons 
            name={collection.icon} 
            size={24} 
            color="#8A56FF"
            className="mb-2" 
          />
          <Text className="text-sm font-medium text-center text-gray-800">
            {collection.name}
          </Text>
        </Card>
      ))}
      <Pressable onPress={onMorePress} className="w-[48%]">
        <Card className="p-4 items-center justify-center bg-white shadow-soft">
          <Ionicons 
            name="ellipsis-horizontal" 
            size={24} 
            color="#8A56FF"
            className="mb-2" 
          />
          <Text className="text-sm font-medium text-center text-gray-800">
            More
          </Text>
        </Card>
      </Pressable>
    </View>
  )
}