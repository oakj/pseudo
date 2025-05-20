import { Text } from "../../../components/ui/text"
import { View } from "react-native"
import { DayColumn } from "./DayColumn"

interface WeeklyStreakProps {
  streak: Array<{
    day: string
    date: number
    status: "completed" | "missed" | "upcoming" | "current"
  }>
  weekStart: Date
}

export function WeeklyStreak({ streak, weekStart }: WeeklyStreakProps) {
  // Convert UTC dates to local time
  const firstDate = new Date(weekStart);
  firstDate.setMinutes(firstDate.getMinutes() + firstDate.getTimezoneOffset());
  firstDate.setHours(0, 0, 0, 0);

  const lastDate = new Date(firstDate);
  lastDate.setDate(lastDate.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric' 
    })
  }
  
  return (
    <View className="mx-auto w-[98%] max-w-[500px] bg-white rounded-2xl px-5 pt-5 pb-5 border border-gray-soft">
      <Text className="font-montserrat-semibold text-lg text-black mb-2">
        Weekly Streak ({formatDate(firstDate)} - {formatDate(lastDate)})
      </Text>
      <View className="flex-row justify-between items-center">
        {streak.map((day) => (
          <DayColumn
            key={day.date}
            day={day.day}
            date={day.date}
            status={day.status}
          />
        ))}
      </View>
    </View>
  )
}

function determineStatus(date: Date, completed: number): "completed" | "missed" | "upcoming" | "current" {
  const today = new Date();
  
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "current";
  }
  
  if (date > today) {
    return "upcoming";
  }
  
  return completed ? "completed" : "missed";
}