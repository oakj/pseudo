import { View } from "react-native"
import { Text } from "../ui/text"
import { cn } from "~/app/lib/utils"

interface WeeklyStreakProps {
  streak: {
    day: string
    date: number
    status: "completed" | "missed" | "upcoming" | "current"
  }[]
}

export function WeeklyStreak({ streak }: WeeklyStreakProps) {
  return (
    <View className="w-[340px] h-[130px] bg-white rounded-xl p-4">
      <Text className="font-montserrat font-semibold text-lg text-black mb-4">
        Weekly Streak
      </Text>
      <View className="flex-row justify-between">
        {streak.map((day) => (
          <View key={day.date} className="items-center">
            <Text 
              className={cn(
                "font-montserrat text-xs text-gray-soft",
                day.status === "current" && "text-white"
              )}
            >
              {day.day}
            </Text>
            <View
              className={cn(
                "w-8 h-8 rounded-full items-center justify-center mt-2",
                day.status === "current" && "bg-black",
                day.status === "completed" && "bg-green-soft",
                day.status === "missed" && "bg-red-soft"
              )}
            >
              <Text
                className={cn(
                  "font-montserrat",
                  day.status === "current" && "text-white",
                  day.status === "completed" && "text-green-hard",
                  day.status === "missed" && "text-red-hard",
                  day.status === "upcoming" && "text-gray-soft"
                )}
              >
                {day.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}