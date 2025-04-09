import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import React from 'react';
import "../global.css";

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
    </View>
  );
}
