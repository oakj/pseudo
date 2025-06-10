import React, { useState } from 'react';
import { View, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../components/auth/AuthHeader';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error: resetError } = await resetPassword(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An error occurred while resetting password');
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
          title="Reset Password"
          subtitle="Enter your email to receive reset instructions"
        />

        {error && (
          <View className="mb-4 p-4 bg-red-50 rounded-lg">
            <Text className="text-red-500 font-montserrat text-center">
              {error}
            </Text>
          </View>
        )}

        {success ? (
          <View className="gap-4">
            <View className="p-4 bg-green-50 rounded-lg">
              <Text className="text-green-600 font-montserrat text-center">
                Check your email for password reset instructions
              </Text>
            </View>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity className="mt-4">
                <Text className="text-primary font-montserrat-medium text-center">
                  Return to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View className="gap-4">
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="go"
              onSubmitEditing={handleResetPassword}
              className="bg-white border border-gray-300 rounded-lg py-3 px-4"
            />

            <Button
              onPress={handleResetPassword}
              disabled={isLoading}
              className="w-full bg-primary rounded-lg py-3"
            >
              <Text className="text-white font-montserrat-medium text-center">
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Text>
            </Button>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-montserrat-medium text-center">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 