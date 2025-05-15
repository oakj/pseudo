import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"
import { Ionicons } from "@expo/vector-icons"

interface Question {
  id: string
  title: string
  difficulty: string
  isSolved: boolean
  leetcodeId: string
}

interface QuestionsByCategoryProps {
  type: "difficulty" | "pattern"
  questions: Question[]
  onBookmarkPress: (questionId: string) => void
}

export function QuestionsByCategory({ type, questions = [], onBookmarkPress }: QuestionsByCategoryProps) {
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-soft text-green-hard';
      case 'medium':
        return 'bg-orange-soft text-orange-hard';
      case 'hard':
        return 'bg-red-soft text-red-hard';
      default:
        return 'bg-gray-soft text-black';
    }
  };

  return (
    <View>
      {questions.map((question) => (
        <View 
          key={question.id} 
          className="flex-row items-center justify-between py-3"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons 
              name={question.isSolved ? "checkmark-circle" : "circle-outline"} 
              size={24} 
              color={question.isSolved ? "#2AB333" : "#FF4E4E"} 
              className="mr-3"
            />
            <Text className="font-montserrat text-base text-black flex-1">
              {question.title}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className={cn(
              "px-2 py-1 rounded-full mr-2",
              getDifficultyStyle(question.difficulty)
            )}>
              <Text className="font-montserrat text-xs capitalize">
                {question.difficulty}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => onBookmarkPress(question.id)}
              className="border border-gray-soft rounded-full p-2"
            >
              <Ionicons 
                name="bookmark-outline" 
                size={20} 
                color="#E7E7E7" 
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )
}