import { Text } from "../../../components/ui/text"
import { View } from "react-native"
import { cn } from "~/app/lib/utils"

interface DayColumnProps {
  day: string
  date: number
  status: "completed" | "missed" | "upcoming" | "current"
}

export function DayColumn({ day, date, status }: DayColumnProps) {
  return (
    <View className="items-center">
      <View className={cn(
        "w-[40px] pb-1 pt-5 px-0 items-center rounded-[40px]",
        status === "current" ? "bg-black" : "bg-white"
      )}>
        <Text className={cn(
          "font-montserrat-semibold text-xs leading-none",
          status === "current" ? "text-white" : "text-gray-hard"
        )}>
          {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
        </Text>
        <View className={cn(
          "w-[30px] h-[30px] rounded-full items-center justify-center mt-1",
          status === "completed" && "bg-green-soft",
          status === "missed" && "bg-red-soft",
          (status === "current" || status === "upcoming") && "bg-white"
        )}>
          <Text className={cn(
            "font-montserrat-bold text-xs",
            status === "current" ? "text-black" : cn(
              status === "completed" && "text-green-hard",
              status === "missed" && "text-red-hard",
              status === "upcoming" && "text-gray-hard"
            )
          )}>
            {date}
          </Text>
        </View>
      </View>
    </View>
  )
} 