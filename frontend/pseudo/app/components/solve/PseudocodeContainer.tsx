import React, { useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { Text } from '../ui/text';
import { useState, useRef } from 'react';
import { cn } from '~/app/lib/utils';
import { AArrowUp } from '~/app/lib/icons/AArrowUp';
import { AArrowDown } from '~/app/lib/icons/AArrowDown';
import { ListPlus } from '~/app/lib/icons/ListPlus';
import { Maximize2 } from '~/app/lib/icons/Maximize2';
import { Minimize2 } from '~/app/lib/icons/Minimize2';
import { HintsBottomDrawer } from './HintsBottomDrawer';
import type { Solution } from '~/app/types/api/userQuestions';

interface PseudocodeContainerProps {
  boilerplateSolution: string;
  userQuestionData: {
    hint_chat: {
      messages: Array<{
        from: 'user' | 'hint_bot';
        message: string;
        timestamp: string;
      }>;
    };
    submission?: {
      solution: Solution;
      timestamp: string;
      evaluation?: any;
    };
  } | null;
  onRequestHint?: () => void;
  onSave?: (data: any) => void;
  isSaving?: boolean;
}

interface NumberedInput {
  number: number;
  text: string;
}

const fontSizes = ['xxs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const;
type FontSize = typeof fontSizes[number];

export function PseudocodeContainer({ 
  boilerplateSolution, 
  userQuestionData,
  onRequestHint,
  onSave,
  isSaving = false
}: PseudocodeContainerProps) {
  const [currentFontSizeIndex, setCurrentFontSizeIndex] = useState(1); // Start with 'xs'
  const [numberedInputs, setNumberedInputs] = useState<NumberedInput[]>(() => {
    if (userQuestionData?.submission?.solution?.lines && 
        userQuestionData.submission.solution.lines.length > 0) {
      return userQuestionData.submission.solution.lines.map(line => ({
        number: line.number,
        text: line.text
      }));
    }
    return [{ number: 1, text: '' }];
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [showHintsDrawer, setShowHintsDrawer] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const screenHeight = Dimensions.get('window').height;

  // Log when hints drawer visibility changes
  useEffect(() => {
    if (showHintsDrawer) {
      console.log('Opening hints drawer with messages:', userQuestionData?.hint_chat.messages);
    }
  }, [showHintsDrawer, userQuestionData]);

  const decreaseFontSize = () => {
    if (currentFontSizeIndex > 0) {
      setCurrentFontSizeIndex(currentFontSizeIndex - 1);
    }
  };

  const increaseFontSize = () => {
    if (currentFontSizeIndex < fontSizes.length - 1) {
      setCurrentFontSizeIndex(currentFontSizeIndex + 1);
    }
  };

  const getFontSize = () => {
    switch (fontSizes[currentFontSizeIndex]) {
      case 'xxs': return 10;
      case 'xs': return 12;
      case 'sm': return 14;
      case 'base': return 16;
      case 'lg': return 18;
      case 'xl': return 20;
      case '2xl': return 24;
      default: return 16;
    }
  };

  const handleNumberedInputChange = (text: string, index: number) => {
    const newInputs = [...numberedInputs];
    newInputs[index] = { ...newInputs[index], text };
    setNumberedInputs(newInputs);
  };

  const addNewInput = () => {
    const nextNumber = numberedInputs.length + 1;
    setNumberedInputs([...numberedInputs, { number: nextNumber, text: '' }]);
  };

  const handleSubmitEditing = (index: number) => {
    // If there's a next input, focus it
    if (index < numberedInputs.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // If we're at the last input, add a new one and focus it
      const nextNumber = numberedInputs.length + 1;
      setNumberedInputs(prev => [...prev, { number: nextNumber, text: '' }]);
      // Use setTimeout to ensure the new input is rendered before focusing
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleSubmit = async () => {
    // First save the current state
    if (onSave) {
      // Filter out empty lines at the end
      const nonEmptyInputs = numberedInputs.filter((input, index) => {
        if (index === numberedInputs.length - 1) {
          return input.text.trim() !== '';
        }
        return true;
      });

      // Update the solution in the format we want
      if (userQuestionData) {
        const updatedData = {
          ...userQuestionData,
          submission: {
            ...userQuestionData.submission,
            solution: {
              lines: nonEmptyInputs
            },
            timestamp: new Date().toISOString()
          }
        };
        await onSave(updatedData);
      }
    }
    
    // TODO: Implement additional submit functionality
    console.log('Submit clicked');
  };

  const handleHints = () => {
    setShowHintsDrawer(true);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    // Filter out empty lines at the end
    const nonEmptyInputs = numberedInputs.filter((input, index) => {
      if (index === numberedInputs.length - 1) {
        return input.text.trim() !== '';
      }
      return true;
    });

    // Update the solution in the format we want
    if (userQuestionData) {
      const updatedData = {
        ...userQuestionData,
        submission: {
          ...userQuestionData.submission,
          solution: {
            lines: nonEmptyInputs
          },
          timestamp: new Date().toISOString()
        }
      };
      onSave(updatedData);
    }
  };

  return (
    <>
      <View 
        className={cn(
          "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4 w-full",
          isMaximized && "absolute top-0 left-0 right-0 z-50 m-0 rounded-none"
        )}
        style={isMaximized ? { height: screenHeight } : {}}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-montserrat-semibold text-lg">
            Pseudocode
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={decreaseFontSize}
              className="p-2 bg-gray-soft rounded-full"
              disabled={currentFontSizeIndex === 0}
            >
              <AArrowDown size={16} className="text-black" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={increaseFontSize}
              className="p-2 bg-gray-soft rounded-full"
              disabled={currentFontSizeIndex === fontSizes.length - 1}
            >
              <AArrowUp size={16} className="text-black" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggleMaximize}
              className="p-2 bg-gray-soft rounded-full"
            >
              {isMaximized ? (
                <Minimize2 size={16} className="text-black" />
              ) : (
                <Maximize2 size={16} className="text-black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="bg-white rounded-lg p-3 mb-4">
          <Text 
            className="font-montserrat-regular text-gray-700 font-mono"
            style={{
              fontSize: getFontSize(),
              lineHeight: getFontSize() * 1.5,
            }}
          >
            {boilerplateSolution}
          </Text>
        </View>

        <View className="bg-gray-50 rounded-lg">
          {numberedInputs.map((input, index) => (
            <View 
              key={input.number} 
              className="w-full flex-row items-start bg-gray-100 rounded-lg p-2"
              style={{
                marginBottom: index === numberedInputs.length - 1 ? 0 : 8
              }}
            >
              <View className="w-8 justify-center">
                <Text 
                  className="font-montserrat-regular text-gray-700 font-mono"
                  style={{
                    fontSize: getFontSize(),
                    lineHeight: getFontSize() * 1.5,
                  }}
                >
                  {input.number}.
                </Text>
              </View>
              <TextInput
                ref={el => inputRefs.current[index] = el}
                value={input.text}
                onChangeText={(text) => handleNumberedInputChange(text, index)}
                onSubmitEditing={() => handleSubmitEditing(index)}
                multiline={false}
                blurOnSubmit={false}
                returnKeyType="next"
                className="flex-1 font-montserrat-regular text-gray-700 font-mono"
                style={{
                  fontSize: getFontSize(),
                  lineHeight: getFontSize() * 1.5,
                }}
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          ))}

          <View className="flex-row justify-between items-center py-2 px-2">
            <TouchableOpacity 
              onPress={addNewInput}
              className="p-2"
            >
              <ListPlus size={24} className="text-black" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <TouchableOpacity 
                onPress={handleSave}
                className="bg-gray-soft px-4 py-2 rounded-full"
                disabled={isSaving}
              >
                <Text className="font-montserrat-medium text-xs">
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSubmit}
                className="bg-red-soft px-4 py-2 rounded-full"
              >
                <Text className="font-montserrat-medium text-xs">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleHints}
                className="bg-gray-soft px-4 py-2 rounded-full"
              >
                <Text className="font-montserrat-medium text-xs">Hints</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Hints Bottom Drawer */}
      {showHintsDrawer && (
        <View className="absolute inset-0 bg-gray-soft/50">
          <HintsBottomDrawer
            messages={userQuestionData?.hint_chat.messages || []}
            onClose={() => setShowHintsDrawer(false)}
            onRequestHint={onRequestHint}
          />
        </View>
      )}
    </>
  );
} 