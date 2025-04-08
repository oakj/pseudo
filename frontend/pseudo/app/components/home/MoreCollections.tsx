import { View } from "react-native"
import { Card } from '../ui/card'
import { Text } from '../ui/text'
import { Ionicons } from "@expo/vector-icons"

interface Collection {
  name: string
  icon: keyof typeof Ionicons.glyphMap
}

export function MoreCollections() {
  const moreCollections: Collection[] = [
    { name: "Custom Group 2", icon: "folder-open" },
    { name: "Custom Group 3", icon: "bookmarks" },
    { name: "Custom Group 4", icon: "layers" },
    { name: "Custom Group 5", icon: "grid" },
    { name: "Amazon", icon: "cart" },
    { name: "Microsoft", icon: "apps" },
    { name: "Facebook", icon: "logo-facebook" },
    { name: "Apple", icon: "logo-apple" },
  ]

  return (
    <View className="flex-row flex-wrap justify-between gap-4 pb-6">
      {moreCollections.map((collection, index) => (
        <Card key={index} className="w-[48%] aspect-square items-center justify-center p-4 bg-white shadow-soft">
          <Ionicons 
            name={collection.icon} 
            size={28} 
            color="#8A56FF"
            className="mb-2" 
          />
          <Text className="text-sm font-medium text-center text-gray-800">
            {collection.name}
          </Text>
        </Card>
      ))}
    </View>
  )
}