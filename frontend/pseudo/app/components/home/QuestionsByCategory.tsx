import { View } from "react-native"
import { Text } from "../ui/text"
import { Badge } from "../ui/badge"
import { cn } from "~/lib/utils"

interface Question {
  name: string
  completed: boolean
  time: string
}

interface QuestionsByCategoryProps {
  type: "difficulty" | "pattern"
}

export function QuestionsByCategory({ type }: QuestionsByCategoryProps) {
  const questions: Question[] = type === "difficulty"
    ? [
        { name: "Two Pointer", completed: true, time: "30s" },
        { name: "Two Sum", completed: false, time: "30s" },
        { name: "Pair with Target Sum", completed: true, time: "30s" },
        { name: "Trapping Rain Water", completed: false, time: "30s" },
        { name: "Back Tracking", completed: true, time: "30s" },
        { name: "Permutations", completed: false, time: "30s" },
        { name: "Sudoku Solver", completed: false, time: "30s" },
      ]
    : [
        { name: "Binary Search", completed: true, time: "30s" },
        { name: "Sliding Window", completed: false, time: "30s" },
        { name: "Dynamic Programming", completed: true, time: "30s" },
        { name: "Greedy", completed: false, time: "30s" },
      ]

  return (
    <View className="bg-white rounded-xl p-2 shadow-soft">
      {questions.map((question, index) => (
        <View key={index} className="flex-row items-center justify-between py-3 px-4 border-b border-gray-200 last:border-b-0">
          <View className="flex-row items-center">
            <View
              className={cn(
                "w-5 h-5 rounded-full mr-3",
                question.completed 
                  ? "bg-success-500" 
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