import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="items-center mb-8">
      <Text className="text-3xl font-montserrat-semibold text-center mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-base font-montserrat text-gray-600 text-center">
          {subtitle}
        </Text>
      )}
    </View>
  );
} 