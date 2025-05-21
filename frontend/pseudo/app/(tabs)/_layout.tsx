import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

console.log('======== TABS LAYOUT FILE IS BEING PROCESSED ========');

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#808080',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}