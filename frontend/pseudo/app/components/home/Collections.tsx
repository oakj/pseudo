import { View, Pressable } from "react-native"
import { Card } from '../ui/card'
import { Text } from '../ui/text'
import { Ionicons } from "@expo/vector-icons"

interface Collection {
  collection_id: string
  collection_name: string
  is_default: boolean
  user_id: string | null
  default_collection_id: string | null
}

// Map collection names to icons
const getCollectionIcon = (name: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Search': 'search',
    'Google': 'logo-google',
    'Bloomberg': 'business',
    'Default': 'folder'
  }
  return iconMap[name] || 'folder'
}

export function Collections({ 
  collections = [], 
  onMorePress 
}: { 
  collections: Collection[]
  onMorePress: () => void 
}) {
  return (
    <View className="flex-row flex-wrap justify-between gap-3">
      {collections.slice(0, 4).map((collection) => (
        <Card 
          key={collection.collection_id} 
          className="w-[48%] p-4 items-center justify-center bg-white shadow-soft"
        >
          <Ionicons 
            name={getCollectionIcon(collection.collection_name)} 
            size={24} 
            color="#8A56FF"
            className="mb-2" 
          />
          <Text className="text-sm font-medium text-center text-gray-800">
            {collection.collection_name}
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