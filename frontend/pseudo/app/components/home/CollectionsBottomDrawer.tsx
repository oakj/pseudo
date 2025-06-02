import { View, TouchableOpacity, ScrollView } from "react-native"
import { Text } from "../ui/text"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"

interface Collection {
  id: string
  name: string
  isDefault: boolean
}

interface CollectionsBottomDrawerProps {
  collections: Collection[]
  onCollectionPress: (collectionId: string, isDefault: boolean) => void
  onClose: () => void
}

export function CollectionsBottomDrawer({
  collections,
  onCollectionPress,
  onClose
}: CollectionsBottomDrawerProps) {
  const [isDefaultExpanded, setIsDefaultExpanded] = useState(true)
  const [isCustomExpanded, setIsCustomExpanded] = useState(true)

  const defaultCollections = collections.filter(c => c.isDefault)
  const customCollections = collections.filter(c => !c.isDefault)

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity 
        className="absolute inset-0 bg-gray-500/50" 
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl pt-3 pb-6">
        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />
        
        {/* Default Collections Section */}
        <TouchableOpacity 
          className="flex-row items-center justify-between px-4 mb-4"
          onPress={() => setIsDefaultExpanded(!isDefaultExpanded)}
        >
          <Text className="font-montserrat-semibold text-lg text-black">
            Default Collections
          </Text>
          <Ionicons 
            name={isDefaultExpanded ? "chevron-down" : "chevron-forward"} 
            size={24} 
            color="#6B7280"
          />
        </TouchableOpacity>

        {isDefaultExpanded && defaultCollections.length > 0 && (
          <ScrollView className="px-4 mb-4">
            {defaultCollections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                className="bg-gray-soft rounded-full mb-2 p-4"
                onPress={() => onCollectionPress(collection.id, collection.isDefault)}
              >
                <Text className="font-montserrat-medium text-xs text-black">
                  {collection.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Custom Collections Section */}
        <TouchableOpacity 
          className="flex-row items-center justify-between px-4 mb-4"
          onPress={() => setIsCustomExpanded(!isCustomExpanded)}
        >
          <Text className="font-montserrat-semibold text-lg text-black">
            Custom Collections
          </Text>
          <Ionicons 
            name={isCustomExpanded ? "chevron-down" : "chevron-forward"} 
            size={24} 
            color="#6B7280"
          />
        </TouchableOpacity>

        {isCustomExpanded && customCollections.length > 0 && (
          <ScrollView className="px-4">
            {customCollections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                className="bg-gray-soft rounded-full mb-2 p-4"
                onPress={() => onCollectionPress(collection.id, collection.isDefault)}
              >
                <Text className="font-montserrat-medium text-xs text-black">
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