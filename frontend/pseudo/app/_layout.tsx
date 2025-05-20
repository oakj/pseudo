import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import "../global.css";

console.log('======== ROOT LAYOUT FILE IS BEING PROCESSED ========');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf')
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  

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
