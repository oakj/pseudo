import { View, TouchableOpacity, ScrollView } from "react-native"
import { Text } from "../ui/text"

interface Collection {
  collection_id: string
  name: string
  has_question: boolean
}

interface SaveQuestionToCollectionBottomDrawerProps {
  collections: Collection[]
  onCollectionPress: (collectionId: string) => void
  onClose: () => void
}

export function SaveQuestionToCollectionBottomDrawer({ 
  collections, 
  onCollectionPress,
  onClose 
}: SaveQuestionToCollectionBottomDrawerProps) {
  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity 
        className="absolute inset-0 bg-gray-500/50" 
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl pt-3 pb-6">
        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />
        <Text className="text-xl font-montserrat font-semibold text-center mb-4">
          Save To:
        </Text>
        <ScrollView className="px-4">
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.collection_id}
              className={`mb-2 p-4 rounded-xl ${collection.has_question ? 'bg-blue-soft' : 'bg-gray-soft'}`}
              onPress={() => onCollectionPress(collection.collection_id)}
            >
              <Text className="font-montserrat text-base text-black">
                {collection.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
} 