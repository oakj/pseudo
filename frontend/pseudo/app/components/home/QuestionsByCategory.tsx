import * as React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"
import { Separator } from "../ui/separator"
import { Ionicons } from "@expo/vector-icons"
import { Bookmark } from "~/app/lib/icons/Bookmark"
import { useRouter } from "expo-router"

interface Question {
  id: string
  title: string
  difficulty: string
  isSolved: boolean
}

interface QuestionsByCategoryProps {
  type: "difficulty" | "pattern"
  questions: Question[]
  onBookmarkPress: (questionId: string) => void
}

export function QuestionsByCategory({ type, questions = [], onBookmarkPress }: QuestionsByCategoryProps) {
  const router = useRouter()

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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <View>
      {questions.map((question, index) => (
        <React.Fragment key={question.id}>
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/solve",
              params: { 
                id: question.id,
                title: question.title,
              }
            })}
          >
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Ionicons 
                  name={question.isSolved ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={question.isSolved ? "#2AB333" : "#FF4E4E"} 
                  className="mr-3"
                />
                <Text className="font-montserrat-medium text-xs text-black flex-1">
                  {truncateText(question.title, 30)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className={cn(
                  "px-2 py-1 rounded-0.5 mr-2",
                  getDifficultyStyle(question.difficulty)
                )}>
                  <Text className="font-montserrat-medium text-xxs capitalize">
                    {question.difficulty}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation() // Prevent triggering parent onPress
                    onBookmarkPress(question.id)
                  }}
                  className="rounded-full p-2"
                >
                  <Bookmark 
                    size={20} 
                    className="text-gray-soft"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <Separator className="bg-gray-soft" />
        </React.Fragment>
      ))}
    </View>
  )
}