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

interface UserQuestionData {
  user_id: string;
  question_id: string;
  submission?: {
    solution: string;
    timestamp: string;
    evaluation?: any;
  };
  hint_chat: {
    messages: Array<{
      from: 'user' | 'hint_bot';
      message: string;
      timestamp: string;
    }>;
  };
}

export default function SolveScreen() {
  const { id, title } = useLocalSearchParams()
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [userQuestionData, setUserQuestionData] = useState<UserQuestionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      console.log('Loading data with id:', id, 'testUserId:', testUserId);
      if (id && testUserId) {
        try {
          // Load question data
          console.log('Attempting to fetch question data for id:', id);
          const { data: qData, error: qError } = await solveScreen.getQuestionData(id as string);
          console.log('Question data response:', { data: qData, error: qError });
          if (qError) throw qError;
          setQuestionData(qData);

          // Get or create user question
          const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(testUserId, id as string);
          if (uqError) throw uqError;

          if (!userQuestion) {
            // Create new user question if it doesn't exist
            const { data: newUserQuestion, error: createError } = await solveScreen.createUserQuestion(testUserId, id as string);
            if (createError) throw createError;

            // Initialize empty user question data
            const initialData = {
              user_id: testUserId,
              question_id: id as string,
              hint_chat: {
                messages: []
              }
            };

            setUserQuestionData(initialData);
          } else {
            // Load existing user question data
            const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(userQuestion.user_question_id);

            if (uqdError) throw uqdError;
            setUserQuestionData(uqData);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [id]);

  const handleRequestHint = () => {
    // TODO: Implement hint request functionality
    console.log('Requesting new hint...');
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
