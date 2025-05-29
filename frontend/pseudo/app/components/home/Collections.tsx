import { TouchableOpacity, View } from "react-native"
import { Text } from "../ui/text"

interface Collection {
  id: string
  name: string
  isDefault: boolean
}

interface CollectionsProps {
  collections: Collection[]
}

export function Collections({ collections }: CollectionsProps) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <View className="flex-row">
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.id}
          className="bg-gray-soft rounded-xl px-4 h-[40px] justify-center mr-2"
        >
          <Text className="font-montserrat-medium text-xs text-black">
            {truncateText(collection.name, 30)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}