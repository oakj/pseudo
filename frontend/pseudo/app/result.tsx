import React from 'react';
import { View, SafeAreaView, Platform, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "./components/ui/text";
import { Header } from "./components/shared/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { solveScreen } from "../supabase";
import { ArrowLeft } from "./lib/icons/ArrowLeft";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id: questionId } = params;
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvaluation() {
      if (!questionId) {
        setError('No question ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(questionId as string);
        if (uqError) throw uqError;

        if (userQuestion?.user_question_id) {
          const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(userQuestion.user_question_id);
          if (uqdError) throw uqdError;
          
          setEvaluation(uqData?.submission?.evaluation);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadEvaluation();
  }, [questionId]);

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

  // Helper function to render objects recursively
  function renderObject(obj: any, level = 0) {
    if (typeof obj !== 'object' || obj === null) {
      return (
        <Text className="font-montserrat-regular text-gray-600 ml-2">{String(obj)}</Text>
      );
    }
    return (
      <View className={level === 0 ? '' : 'ml-4'}>
        {Object.entries(obj).map(([k, v]) => {
          // If value is a number, render key and value on the same line
          if (typeof v === 'number') {
            return (
              <View key={k} className="flex-row items-center mb-1">
                <Text className="font-montserrat-medium text-gray-700 mr-1">
                  {k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                </Text>
                <Text className="font-montserrat-regular text-gray-600">
                  {v.toFixed(2)}
                </Text>
              </View>
            );
          }
          // Otherwise, render as before
          return (
            <View key={k} className="mb-1">
              <Text className="font-montserrat-medium text-gray-700">
                {k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
              </Text>
              {renderObject(v, level + 1)}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar 
        barStyle="dark-content"
        {...(Platform.OS === 'android' 
          ? {
              backgroundColor: "#F9FAFB",
              translucent: true
            } 
          : {}
        )}
      />
      
      <View style={{ paddingTop: statusBarHeight }} className="flex-1">
        <Header title="Pseudo" />
        
        <ScrollView className="flex-1 px-4 mt-4">
          {loading ? (
            <Text className="text-center mt-4">Loading results...</Text>
          ) : error ? (
            <Text className="text-center mt-4 text-red-500">
              Error: {error}
            </Text>
          ) : evaluation ? (
            <View className="bg-white rounded-lg p-4">
            <View className="flex-row items-center relative">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="absolute left-0 z-10"
                >
                    <ArrowLeft size={24} className="text-black" />
                </TouchableOpacity>
                <Text className="font-montserrat-semibold text-xl mb-4 flex-1 text-center">
                Results
              </Text>
            </View>
              <View className="space-y-4">
                {Object.entries(evaluation).map(([key, value]) => {
                  // Special handling for suggestions array
                  if (key.toLowerCase() === 'suggestions' && Array.isArray(value)) {
                    return (
                      <View key={key} className="border-b border-gray-200 pb-4">
                        <Text className="font-montserrat-semibold text-lg text-gray-800 mb-2">
                          Suggestions
                        </Text>
                        <View className="bg-gray-50 rounded-lg p-3 space-y-2">
                          {value.map((suggestion, idx) => (
                            <View key={idx}>
                              <Text className="font-montserrat-regular text-gray-600">
                                {suggestion}
                              </Text>
                              <View style={{ height: 8 }} />
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  }
                  // Render objects (like feedback) recursively
                  return (
                    <View key={key} className="border-b border-gray-200 pb-4">
                      <Text className="font-montserrat-semibold text-lg text-gray-800 mb-2">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Text>
                      {typeof value === 'object' && value !== null ? (
                        <View className="bg-gray-50 rounded-lg p-3">
                          {renderObject(value)}
                        </View>
                      ) : (
                        <Text className="font-montserrat-regular text-gray-600">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                            typeof value === 'number' ? value.toFixed(2) :
                            String(value)}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text className="text-center mt-4 text-red-500">
              No evaluation data available
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
