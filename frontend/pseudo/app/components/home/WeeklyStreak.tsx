import { View } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"

interface WeeklyStreakProps {
  streak: number[]
}

export function WeeklyStreak({ streak = [] }: WeeklyStreakProps) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const today = new Date().getDay() // 0-6, where 0 is Sunday
  
  // Calculate which days should be marked as completed
  const getIsCompleted = (dayIndex: number) => {
    return streak.includes(dayIndex)
  }

  return (
    <View className="bg-white rounded-xl p-4 shadow-soft">
      <Text className="text-base font-semibold mb-3 text-gray-800">
        Weekly Streak
      </Text>
      <View className="flex-row justify-between mt-2">
        {days.map((day, index) => (
          <View key={index} className="items-center">
            <Text className="text-xs text-gray-400 mb-2">{day}</Text>
            <View
              className={cn(
                "w-6 h-6 rounded-full",
                getIsCompleted(index) ? "bg-success-500" : "bg-error-500"
              )}
            />
          </View>
        ))}
      </View>
    </View>
  )
}