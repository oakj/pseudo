import { View } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"

export function WeeklyStreak() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const streakData = [true, true, false, true, true, false, false]

  return (
    <View className="bg-white rounded-xl p-4 shadow-soft">
      <Text className="text-base font-semibold mb-3 text-gray-800">
        Weekly Streak (1/12 - 1/18)
      </Text>
      <View className="flex-row justify-between mt-2">
        {days.map((day, index) => (
          <View key={index} className="items-center">
            <Text className="text-xs text-gray-400 mb-2">{day}</Text>
            <View
              className={cn(
                "w-6 h-6 rounded-full",
                streakData[index] ? "bg-green-500" : "bg-red-500"
              )}
            />
          </View>
        ))}
      </View>
    </View>
  )
} 