import { View, TouchableOpacity } from "react-native"
import { Button } from "../ui/button"
import { Text } from "../ui/text"
import { Link } from "expo-router"
import { cn } from "~/lib/utils"

interface HeaderProps {
  title?: string
}

export function Header({ title = "PseudoSolve" }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-4 pt-4 pb-2 bg-white border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      <Link href="/(tabs)/settings" asChild>
        <TouchableOpacity>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Text className="text-lg text-primary">P</Text>
          </Button>
        </TouchableOpacity>
      </Link>
    </View>
  )
}