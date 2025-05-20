import { View, TouchableOpacity } from "react-native"
import { Button } from "../ui/button"
import { Text } from "../ui/text"
import { Link } from "expo-router"
import { Avatar, AvatarImage } from "../ui/avatar"

interface HeaderProps {
  title?: string
}

export function Header({ title = "Pseudo" }: HeaderProps) {
  return (
    <View 
      className="flex-row justify-between items-center px-4 bg-white h-[60px] w-full"
    >
      <Text 
        className="text-black text-xl font-montserrat-semibold"
      >
        {title}
      </Text>

      <Link href="/(tabs)/profile" asChild>
        <TouchableOpacity>
          <View 
            className="bg-gray-100 rounded-full items-center justify-center h-[40px] w-[40px]"
          >
            <Avatar alt="Avatar">
              <AvatarImage source={require('../../../assets/avatars/bosty-1.png')} />
            </Avatar>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  )
}