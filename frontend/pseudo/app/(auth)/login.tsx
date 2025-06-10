import React, { useState } from 'react';
import { View, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../components/auth/AuthHeader';
import { EmailLoginForm } from '../components/auth/EmailLoginForm';
import { SocialButtons } from '../components/auth/SocialButtons';
import { Text } from '../components/ui/text';

export default function LoginScreen() {
  const [error, setError] = useState<string | null>(null);
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent 
      />
      
      <ScrollView 
        className="flex-1 px-6"
        style={{ paddingTop: statusBarHeight }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <AuthHeader 
          title="Welcome"
          subtitle="Sign in to continue"
        />

        {error && (
          <View className="mb-4 p-4 bg-red-50 rounded-lg">
            <Text className="text-red-500 font-montserrat text-center">
              {error}
            </Text>
          </View>
        )}

        <View className="gap-8">
          <EmailLoginForm onError={handleError} />
          
          <View className="flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-600 font-montserrat">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <SocialButtons onError={handleError} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 