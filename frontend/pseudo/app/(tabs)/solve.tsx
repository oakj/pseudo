import React from 'react';
import { View, SafeAreaView, Platform, StatusBar, ScrollView } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { solveScreen } from "../../supabase"
import { QuestionDescription } from "../components/solve/QuestionDescription"
import { PseudocodeContainer } from "../components/solve/PseudocodeContainer"

interface QuestionData {
  description: string;
  constraints: string[];
  boilerplate_solution: {
    language: string;
    pseudocode: string;
  };
}

export default function SolveScreen() {
  const { id, title, leetcodeId } = useLocalSearchParams()
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestionData() {
      if (id && leetcodeId) {
        const { data, error } = await solveScreen.getQuestionData(id as string, leetcodeId as string);
        
        if (data) {
          setQuestionData(data);
        }
        setLoading(false);
      }
    }
    loadQuestionData();
  }, [id, leetcodeId]);

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
        <Header showBack title="Pseudo" />
        
        <ScrollView className="px-4 mt-4">
          {loading ? (
            <Text className="text-center mt-4">Loading question data...</Text>
          ) : questionData ? (
            <>
              <QuestionDescription
                leetcodeId={leetcodeId as string}
                title={title as string}
                description={questionData.description}
                constraints={questionData.constraints}
              />
              
              <PseudocodeContainer
                boilerplateSolution={questionData.boilerplate_solution.pseudocode}
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
