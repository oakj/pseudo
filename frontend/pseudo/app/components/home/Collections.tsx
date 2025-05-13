import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "../ui/text"

interface Collection {
  collection_id: string
  name: string
}

interface CollectionsProps {
  collections: Collection[]
  onMorePress: () => void
}

export function Collections({ collections, onMorePress }: CollectionsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-4"
    >
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.collection_id}
          className="bg-gray-100 rounded-full px-4 h-[50px] justify-center mr-2"
        >
          <Text className="font-montserrat text-base text-black">
            {collection.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onMorePress}
        className="bg-gray-100 rounded-full px-4 h-[50px] justify-center"
      >
        <Text className="font-montserrat text-xxs text-black">More</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}