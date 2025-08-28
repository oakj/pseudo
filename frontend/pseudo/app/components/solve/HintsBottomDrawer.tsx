import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface HintMessage {
  from: 'user' | 'hint_bot';
  message: string;
  timestamp: string;
}

interface HintsBottomDrawerProps {
  messages: HintMessage[];
  onClose: () => void;
  onRequestHint?: () => void;
}

export function HintsBottomDrawer({ messages, onClose, onRequestHint }: HintsBottomDrawerProps) {
  console.log('HintsBottomDrawer received messages:', messages);
  
  return (
    <View className="absolute inset-0 z-[60]">
      <TouchableOpacity 
        className="absolute inset-0 bg-gray-500/50" 
        activeOpacity={1} 
        onPress={onClose}
      />
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="font-montserrat-semibold text-lg">Hints</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          className="p-4"
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: messages.length === 0 ? 1 : undefined }}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <View 
                key={index} 
                className="bg-gray-50 rounded-lg p-4 mb-3"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-montserrat-medium text-xs text-gray-500">
                    Hint Bot
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </Text>
                </View>
                <Text className="text-gray-700">{message.message}</Text>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">No hints available</Text>
            </View>
          )}
        </ScrollView>

        {/* Request Hint Button */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={onRequestHint}
            className="bg-primary/10 py-2 px-4 rounded-full self-center"
          >
            <Text className="text-xs text-primary font-montserrat-medium">
              Request a Hint
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
