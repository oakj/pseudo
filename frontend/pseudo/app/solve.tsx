import React from 'react';
import { View, SafeAreaView, Platform, StatusBar, ScrollView } from "react-native"
import { Text } from "./components/ui/text"
import { Header } from "./components/shared/Header"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { solveScreen } from "../supabase"
import { QuestionDescription } from "./components/solve/QuestionDescription"
import { PseudocodeContainer } from "./components/solve/PseudocodeContainer"
import Constants from 'expo-constants'
import { createEmptyUserQuestionFile, mapToUserQuestionFile } from './lib/utils'
import type { UserQuestionData, UserQuestion } from '@/types/api/userQuestions'

const testUserId = Constants.expoConfig?.extra?.supabaseTestUserId

interface QuestionData {
  description: string;
  constraints: string[];
  boilerplate_solution: {
    language: string;
    pseudocode: string;
  };
  hints: string[];
}

export default function SolveScreen() {
  const params = useLocalSearchParams()
  const { id: questionId, title } = params
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [userQuestionData, setUserQuestionData] = useState<UserQuestionData | null>(null);
  const [userQuestionId, setUserQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!questionId) {
        setError('No question ID provided');
        setLoading(false);
        return;
      }

      if (!testUserId) {
        setError('No test user ID found');
        setLoading(false);
        return;
      }

      try {
        const { data: qData, error: qError } = await solveScreen.getQuestionData(questionId as string);
        if (qError) {
          console.error('Error fetching question data:', qError);
          throw qError;
        }
        setQuestionData(qData);

        const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(testUserId, questionId as string);
        if (uqError) {
          console.error('Error fetching user question:', uqError);
          throw uqError;
        }

        if (!userQuestion) {
          const { data: newUserQuestion, error: createError } = await solveScreen.createUserQuestion(testUserId, questionId as string);
          if (createError) {
            console.error('Error creating user question:', createError);
            throw createError;
          }
          setUserQuestionId(newUserQuestion?.id);
          const initialData = createEmptyUserQuestionFile(testUserId, questionId as string);
          setUserQuestionData(initialData);
        } else {
          setUserQuestionId(userQuestion.id);
          const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(userQuestion.id);
          if (uqdError) {
            console.error('Error fetching user question data:', uqdError);
            const initialData = createEmptyUserQuestionFile(testUserId, questionId as string);
            setUserQuestionData(initialData);
          } else {
            setUserQuestionData(uqData);
          }
        }
      } catch (error) {
        console.error('Error in loadData:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [questionId]);

  const handleRequestHint = () => {
    // TODO: Implement hint request functionality
    console.log('Requesting new hint...');
  };

  const handleSave = async () => {
    if (!userQuestionId || !userQuestionData) {
      console.error('Cannot save: missing user question ID or data');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await solveScreen.updateUserQuestionFile(userQuestionId, userQuestionData);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error saving question data:', error);
      // You might want to show a toast or some other UI feedback here
    } finally {
      setIsSaving(false);
    }
  };

  // On Android, we need to manually account for the status bar height
  // On iOS, SafeAreaView handles this automatically
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0

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
        <Header showBackButton title="Pseudo" />
        
        <ScrollView className="flex-1 px-4 mt-4">
          {loading ? (
            <Text className="text-center mt-4">Loading question data...</Text>
          ) : error ? (
            <Text className="text-center mt-4 text-red-500">
              Error: {error}
            </Text>
          ) : questionData ? (
            <>
              <QuestionDescription
                title={title as string}
                description={questionData.description}
                constraints={questionData.constraints}
              />
              
              <PseudocodeContainer
                boilerplateSolution={questionData.boilerplate_solution.pseudocode}
                userQuestionData={userQuestionData}
                onRequestHint={handleRequestHint}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </>
          ) : (
            <Text className="text-center mt-4 text-red-500">
              Failed to load question data
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
