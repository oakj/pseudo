import * as React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"
import { Separator } from "../ui/separator"
import { Ionicons } from "@expo/vector-icons"
import { Bookmark } from "~/app/lib/icons/Bookmark"

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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <View>
      {questions.map((question, index) => (
        <React.Fragment key={question.id}>
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
                onPress={() => onBookmarkPress(question.id)}
                className="rounded-full p-2"
              >
                <Bookmark 
                  size={20} 
                  className="text-gray-soft"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Separator className="bg-gray-soft" />
        </React.Fragment>
      ))}
    </View>
  )
}