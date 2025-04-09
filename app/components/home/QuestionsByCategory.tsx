import { View } from "react-native"
import { Text } from "../ui/text"
import { Badge } from "../ui/badge"
import { cn } from "~/app/lib/utils"

export function QuestionsByCategory({ type }: QuestionsByCategoryProps) {
  // ... existing code

  return (
    <View className="bg-white rounded-xl p-2 shadow-soft">
      {questions.map((question, index) => (
        <View key={index} className="flex-row items-center justify-between py-3 px-4 border-b border-gray-200 last:border-b-0">
          <View className="flex-row items-center">
            <View
              className={cn(
                "w-5 h-5 rounded-full mr-3",
                question.completed 
                  ? "bg-green-500" // Changed from success-500
                  : "bg-white border border-gray-200"
              )}
            />
            <Text className="text-sm text-gray-800">{question.name}</Text>
          </View>
          <Badge variant="secondary" className="bg-accent px-2 py-1">
            <Text className="text-xs text-white">{question.time}</Text>
          </Badge>
        </View>
      ))}
    </View>
  )
} 