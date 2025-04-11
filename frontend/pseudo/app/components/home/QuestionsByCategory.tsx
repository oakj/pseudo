import { View } from "react-native"
import { Text } from "../ui/text"
import { Badge } from "../ui/badge"
import { cn } from "~/app/lib/utils"

interface Question {
  question_id: string
  title: string
  difficulty: string
  design_patterns: string[]
  is_solved: boolean
  leetcode_id: string
}

interface QuestionsByCategoryProps {
  type: "difficulty" | "pattern"
  questions: Question[]
}

export function QuestionsByCategory({ type, questions = [] }: QuestionsByCategoryProps) {
  const groupedQuestions = type === "difficulty"
    ? questions.reduce((acc, q) => {
        acc[q.difficulty] = acc[q.difficulty] || []
        acc[q.difficulty].push(q)
        return acc
      }, {} as Record<string, Question[]>)
    : questions.reduce((acc, q) => {
        q.design_patterns.forEach(pattern => {
          acc[pattern] = acc[pattern] || []
          acc[pattern].push(q)
        })
        return acc
      }, {} as Record<string, Question[]>)

  return (
    <View className="bg-white rounded-xl p-2 shadow-soft">
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <View key={category}>
          {categoryQuestions.map((question) => (
            <View 
              key={question.question_id} 
              className="flex-row items-center justify-between py-3 px-4 border-b border-gray-200 last:border-b-0"
            >
              <View className="flex-row items-center">
                <View
                  className={cn(
                    "w-5 h-5 rounded-full mr-3",
                    question.is_solved 
                      ? "bg-success-500" 
                      : "bg-white border border-gray-200"
                  )}
                />
                <Text className="text-sm text-gray-800">{question.title}</Text>
              </View>
              <Badge variant="secondary" className="bg-accent px-2 py-1">
                <Text className="text-xs text-white">
                  {type === "difficulty" ? question.design_patterns[0] : question.difficulty}
                </Text>
              </Badge>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}