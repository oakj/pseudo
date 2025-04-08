import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import React from 'react';
import "../global.css";
import { Tabs } from "@expo-router/tabs";

export default function RootLayout() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" backgroundColor="#F8F7FC" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F8F7FC"
          }
        }}
      />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF', // White header
          },
          headerTintColor: '#000000', // Black text/icons in header
          tabBarStyle: {
            backgroundColor: '#FFFFFF', // White navigation bar
          },
          tabBarActiveTintColor: '#000000', // Black active icons
          tabBarInactiveTintColor: '#808080', // Gray inactive icons
        }}
      >
      </Tabs>
    </View>
  );
}
