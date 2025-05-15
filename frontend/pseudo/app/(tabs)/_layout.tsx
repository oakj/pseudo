import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function TabsLayout() {
  console.log('======== TABS LAYOUT MOUNTED ========');
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
      <Tabs.Screen
         name="testing"
         options={{
           title: "Testing",
           tabBarIcon: ({ color, size }) => <Ionicons name="bug-outline" size={size} color={color} />,
         }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}