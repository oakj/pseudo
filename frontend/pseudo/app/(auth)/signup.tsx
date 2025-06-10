import React, { useState, useRef } from 'react';
import { View, ScrollView, Platform, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../components/auth/AuthHeader';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const handleSignup = async () => {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.replace('/(auth)/login');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
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
          title="Create Account"
          subtitle="Sign up to get started"
        />

        {error && (
          <View className="mb-4 p-4 bg-red-50 rounded-lg">
            <Text className="text-red-500 font-montserrat text-center">
              {error}
            </Text>
          </View>
        )}

        <View className="gap-4">
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
              autoComplete="password-new"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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

          <View className="relative">
            <Input
              ref={confirmPasswordRef}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              returnKeyType="go"
              onSubmitEditing={handleSignup}
              className="bg-white border border-gray-300 rounded-lg py-3 px-4 pr-12"
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-0 bottom-0 justify-center"
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={24} 
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleSignup}
            disabled={isLoading}
            className="w-full bg-primary rounded-lg py-3 mt-4"
          >
            <Text className="text-white font-montserrat-medium text-center">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Text>
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600 font-montserrat">
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-montserrat-medium">
                  Sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 