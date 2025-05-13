import { View, TouchableOpacity, ScrollView } from "react-native"
import { Text } from "../ui/text"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"

interface Collection {
  collection_id: string
  name: string
}

interface CollectionsBottomDrawerProps {
  collections: Collection[]
  onCollectionPress: (collectionId: string) => void
  onClose: () => void
}

export function CollectionsBottomDrawer({
  collections,
  onCollectionPress,
  onClose
}: CollectionsBottomDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity 
        className="absolute inset-0 bg-gray-500/50" 
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl pt-3 pb-6">
        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />
        
        <TouchableOpacity 
          className="flex-row items-center justify-between px-4 mb-4"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text className="text-xl font-montserrat font-semibold text-gray-800">
            Default Collections
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-down" : "chevron-forward"} 
            size={24} 
            color="#6B7280"
          />
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView className="px-4">
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection.collection_id}
                className="bg-gray-soft rounded-full mb-2 p-4"
                onPress={() => onCollectionPress(collection.collection_id)}
              >
                <Text className="font-montserrat text-base text-black">
                  {collection.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  )
} 