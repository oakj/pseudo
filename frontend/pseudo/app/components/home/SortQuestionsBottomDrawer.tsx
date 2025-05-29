import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

type SortOption = "nameAsc" | "nameDesc" | "difficultyAsc" | "difficultyDesc"

interface SortQuestionsBottomDrawerProps {
  selectedSort: SortOption
  onSortChange: (value: SortOption) => void
  onClose: () => void
}

function RadioGroupItemWithLabel({
  value,
  label,
  onLabelPress,
}: {
  value: string
  label: string
  onLabelPress: () => void
}) {
  return (
    <View className="flex-row items-center gap-3">
      <RadioGroupItem 
        value={value} 
        aria-labelledby={`label-for-${value}`}
      />
      <Text 
        nativeID={`label-for-${value}`}
        onPress={onLabelPress}
        className="text-black"
      >
        {label}
      </Text>
    </View>
  )
}

export function SortQuestionsBottomDrawer({ 
  selectedSort,
  onSortChange,
  onClose 
}: SortQuestionsBottomDrawerProps) {
  const sortOptions = [
    { value: 'nameAsc', label: 'Name (A to Z)' },
    { value: 'nameDesc', label: 'Name (Z to A)' },
    { value: 'difficultyAsc', label: 'Difficulty (Easy to Hard)' },
    { value: 'difficultyDesc', label: 'Difficulty (Hard to Easy)' }
  ] as const

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity 
        className="absolute inset-0 bg-gray-500/50" 
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl pt-3 pb-6">
        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-4" />
        
        <View className="px-4">
          <Text className="font-montserrat-semibold text-lg text-black mb-4 text-center">
            Sort By
          </Text>
          
          <RadioGroup value={selectedSort} onValueChange={onSortChange} className="gap-4">
            {sortOptions.slice(0, 2).map((option) => (
              <RadioGroupItemWithLabel
                key={option.value}
                value={option.value}
                label={option.label}
                onLabelPress={() => onSortChange(option.value)}
              />
            ))}

            {sortOptions.slice(2).map((option) => (
              <RadioGroupItemWithLabel
                key={option.value}
                value={option.value}
                label={option.label}
                onLabelPress={() => onSortChange(option.value)}
              />
            ))}
          </RadioGroup>
        </View>
      </View>
    </View>
  )
}