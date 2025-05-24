import { Tabs } from "expo-router"
import { Layers } from '../lib/icons/Layers'
import { House } from '../lib/icons/House'
import { SquareTerminal } from '../lib/icons/SquareTerminal'
import { View, Text } from 'react-native'

console.log('======== TABS LAYOUT FILE IS BEING PROCESSED ========');

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 50,
          maxWidth: 500,
          alignSelf: 'center',
          width: '100%',
          backgroundColor: '#FFFFFF',
          paddingBottom: 8,
          marginTop: 4,
          borderTopWidth: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          overflow: 'hidden',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#E7E7E7',
          shadowColor: '#18181B',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarItemStyle: {
          position: 'relative',
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarLabelStyle: {
          fontSize: 8,
          fontFamily: 'Montserrat-Medium',
          marginTop: 0,
          color: '#18181B',
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabel: ({ focused, children }) => {
          return (
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 8,
                fontFamily: 'Montserrat-Medium',
                color: '#18181B',
                marginTop: 0,
              }}>
                {children}
              </Text>
            </View>
          )
        },
      }}
    >
      <Tabs.Screen
        name="flashcards"
        options={{
          title: "CARDS",
          tabBarIcon: ({ color }) => <Layers size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="algorithms"
        options={{
          title: "ALGOS",
          tabBarIcon: ({ color }) => <SquareTerminal size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}