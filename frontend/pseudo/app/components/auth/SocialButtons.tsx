import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../ui/text';
import { useAuth } from '../../contexts/AuthContext';

interface SocialButtonsProps {
  onError?: (error: Error) => void;
}

export function SocialButtons({ onError }: SocialButtonsProps) {
  const { loginWithGoogle, loginWithApple } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error && onError) {
      onError(error);
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await loginWithApple();
    if (error && onError) {
      onError(error);
    }
  };

  return (
    <View className="w-full gap-4">
      <TouchableOpacity
        onPress={handleGoogleLogin}
        className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex-row items-center justify-center"
      >
        <Text className="text-black font-montserrat-medium">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={handleAppleLogin}
          className="w-full bg-black rounded-lg py-3 px-4 flex-row items-center justify-center"
        >
          <Text className="text-white font-montserrat-medium">
            Continue with Apple
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 