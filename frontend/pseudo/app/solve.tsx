import React from 'react';
import { View, SafeAreaView, Platform, StatusBar, ScrollView } from "react-native"
import { Text } from "./components/ui/text"
import { Header } from "./components/shared/Header"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { solveScreen, supabase } from "../supabase"
import { QuestionDescription } from "./components/solve/QuestionDescription"
import { PseudocodeContainer } from "./components/solve/PseudocodeContainer"
import { createEmptyUserQuestionFile, mapToUserQuestionFile } from './lib/utils'
import type { UserQuestionData, UserQuestion } from '@/types/api/userQuestions'

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
      console.log('=== Starting loadData function ===');
      if (!questionId) {
        console.error('No question ID provided');
        setError('No question ID provided');
        setLoading(false);
        return;
      }

      console.log('Loading data for question ID:', questionId);
      try {
        console.log('Calling solveScreen.getQuestionData...');
        const { data: qData, error: qError } = await solveScreen.getQuestionData(questionId as string);
        
        if (qError) {
          console.error('Error from getQuestionData:', qError);
          console.error('Error details:', JSON.stringify(qError, Object.getOwnPropertyNames(qError)));
          throw qError;
        }

        console.log('Question data successfully fetched:', qData ? 'Data present' : 'No data');
        setQuestionData(qData);

        console.log('Fetching user question data...');
        const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(questionId as string);
        
        if (uqError) {
          console.error('Error from getUserQuestion:', uqError);
          console.error('Error details:', JSON.stringify(uqError, Object.getOwnPropertyNames(uqError)));
          throw uqError;
        }

        if (!userQuestion) {
          console.log('No existing user question found, creating new one...');
          const { data: newUserQuestion, error: createError } = await solveScreen.createUserQuestion(questionId as string);
          
          if (createError) {
            console.error('Error creating user question:', createError);
            console.error('Error details:', JSON.stringify(createError, Object.getOwnPropertyNames(createError)));
            throw createError;
          }

          if (newUserQuestion?.id) {
            console.log('New user question created with ID:', newUserQuestion.id);
            setUserQuestionId(newUserQuestion.id);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const initialData = createEmptyUserQuestionFile(user.id, questionId as string);
              setUserQuestionData(initialData);
            }
          }
        } else {
          console.log('Existing user question found with ID:', userQuestion.user_question_id);
          setUserQuestionId(userQuestion.user_question_id);
          
          const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(userQuestion.user_question_id);
          if (uqdError) {
            console.error('Error fetching user question data:', uqdError);
            console.error('Error details:', JSON.stringify(uqdError, Object.getOwnPropertyNames(uqdError)));
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const initialData = createEmptyUserQuestionFile(user.id, questionId as string);
              setUserQuestionData(initialData);
            }
          } else {
            setUserQuestionData(uqData);
          }
        }
      } catch (error) {
        console.error('Error in loadData:', error);
        console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        console.log('=== Finished loadData function ===');
        setLoading(false);
      }
    }

    loadData();
  }, [questionId]);

  const handleRequestHint = () => {
    // TODO: Implement hint request functionality
    console.log('Requesting new hint...');
  };

  const handleSave = async (updatedData: UserQuestionData) => {
    if (!userQuestionId || !updatedData) {
      console.error('Cannot save: missing user question ID or data');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await solveScreen.updateUserQuestionFile(userQuestionId, updatedData);
      if (error) {
        throw error;
      }
      // Update local state
      setUserQuestionData(updatedData);
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
