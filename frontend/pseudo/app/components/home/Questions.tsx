import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { Badge } from "../ui/badge"
import { Ionicons } from "@expo/vector-icons"
import { cn } from "~/app/lib/utils"
import { useState } from "react"
import { SaveQuestionToCollectionBottomDrawer } from "./SaveQuestionToCollectionBottomDrawer"

interface Question {
  question_id: string
  title: string
  difficulty: string
  is_solved: boolean
  saved_to_collection: boolean
}

interface QuestionsProps {
  questions: Question[]
  onSortByDifficulty?: () => void
  onSortByStatus?: () => void
}

export function Questions({ questions, onSortByDifficulty, onSortByStatus }: QuestionsProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSaveDrawer, setShowSaveDrawer] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const handleBookmarkPress = (questionId: string) => {
    setSelectedQuestionId(questionId)
    setShowSaveDrawer(true)
  }

  return (
    <>
      <View className="bg-white rounded-xl shadow-soft">
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text className="text-2xl font-montserrat font-semibold text-black">Questions</Text>
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {showDropdown && (
          <View className="absolute right-4 top-12 bg-white rounded-xl shadow-lg z-10 p-2">
            <TouchableOpacity 
              className="bg-gray-soft rounded-full px-3 py-2 mb-2"
              onPress={() => {
                onSortByDifficulty?.()
                setShowDropdown(false)
              }}
            >
              <Text className="font-montserrat text-xxs text-black">Sort by Difficulty</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-soft rounded-full px-3 py-2"
              onPress={() => {
                onSortByStatus?.()
                setShowDropdown(false)
              }}
            >
              <Text className="font-montserrat text-xxs text-black">Sort by Status</Text>
            </TouchableOpacity>
          </View>
        )}

        {questions.map((question) => (
          <View 
            key={question.question_id} 
            className="flex-row items-center justify-between py-3 px-4 border-b border-gray-200 last:border-b-0"
          >
            <View className="flex-row items-center flex-1">
              <Ionicons 
                name={question.is_solved ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={question.is_solved ? "#22C55E" : "#EF4444"} 
              />
              <Text className="ml-3 text-base font-montserrat text-black flex-1">
                {question.title}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Badge 
                variant={
                  question.difficulty === "easy" ? "default" : 
                  question.difficulty === "medium" ? "secondary" : 
                  "destructive"
                }
              >
                <Text>{question.difficulty}</Text>
              </Badge>
              <TouchableOpacity onPress={() => handleBookmarkPress(question.question_id)}>
                <Ionicons 
                  name="bookmark" 
                  size={20} 
                  color={question.saved_to_collection ? "#3B82F6" : "#E5E7EB"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {showSaveDrawer && selectedQuestionId && (
        <SaveQuestionToCollectionBottomDrawer
          collections={[]} // This should be populated with actual collections
          onCollectionPress={(collectionId) => {
            // Handle saving/removing question to/from collection
          }}
          onClose={() => {
            setShowSaveDrawer(false)
            setSelectedQuestionId(null)
          }}
        />
      )}
    </>
  )
} 
