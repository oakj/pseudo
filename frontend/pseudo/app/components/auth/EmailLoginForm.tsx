import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface EmailLoginFormProps {
  onError?: (error: Error) => void;
}

export function EmailLoginForm({ onError }: EmailLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      onError?.(new Error('Please fill in all fields'));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await login(email, password);
      if (error && onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full gap-4">
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
        className="bg-white border border-gray-300 rounded-lg py-3 px-4"
      />

      <View className="relative">
        <Input
          ref={passwordRef}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          className="bg-white border border-gray-300 rounded-lg py-3 px-4 pr-12"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-0 bottom-0 justify-center"
        >
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={24} 
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-end">
        <Link href="/(auth)/forgot" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-gray-600 font-montserrat">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Button
        onPress={handleSubmit}
        disabled={isLoading}
        className="w-full bg-primary border border-gray-300 rounded-lg py-3"
      >
        <Text className="text-black font-montserrat-medium text-center">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Text>
      </Button>

      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600 font-montserrat">
          Don't have an account?{' '}
        </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-montserrat-medium">
              Sign up
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
} 