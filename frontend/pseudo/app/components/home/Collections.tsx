import { TouchableOpacity, View } from "react-native"
import { Text } from "../ui/text"

interface Collection {
  id: string
  name: string
  isDefault: boolean
}

interface CollectionsProps {
  collections: Collection[]
  onMorePress: () => void
}

export function Collections({ collections, onMorePress }: CollectionsProps) {
  return (
    <View className="flex-row">
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.id}
          className="bg-gray-soft rounded-full px-4 h-[50px] justify-center mr-2"
        >
          <Text className="font-montserrat text-base text-black">
            {collection.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onMorePress}
        className="bg-gray-soft rounded-full px-4 h-[50px] justify-center"
      >
        <Text className="font-montserrat text-xxs text-black">More</Text>
      </TouchableOpacity>
    </View>
  )
}