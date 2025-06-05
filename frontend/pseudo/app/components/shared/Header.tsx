import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { Link, useRouter } from "expo-router"
import { Avatar, AvatarImage } from "../ui/avatar"
import { useAvatar } from "../../contexts/AvatarContext"

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title = "Pseudo", showBackButton = false }: HeaderProps) {
  const router = useRouter()
  const { selectedAvatar } = useAvatar()

  return (
    <View 
      className="flex-row justify-between items-center px-4 bg-white h-[60px] w-full"
    >
      <TouchableOpacity onPress={() => showBackButton ? router.back() : router.push("/(tabs)/home")}>
        <Text 
          className="text-black text-xl font-montserrat-semibold"
        >
          {title}
        </Text>
      </TouchableOpacity>

      <Link href="/profile" asChild>
        <TouchableOpacity>
          <View 
            className="bg-gray-100 rounded-full items-center justify-center h-[40px] w-[40px]"
          >
            <Avatar alt="Avatar">
              <AvatarImage source={selectedAvatar.url} />
            </Avatar>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  )
}