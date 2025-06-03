import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { ChevronsDownUp } from '../../lib/icons/ChevronsDownUp';
import { useState } from 'react';
import { cn } from '~/app/lib/utils';

interface QuestionDescriptionProps {
  leetcodeId: string;
  title: string;
  description: string;
  constraints: string[];
}

export function QuestionDescription({ leetcodeId, title, description, constraints }: QuestionDescriptionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <TouchableOpacity 
        onPress={() => setIsCollapsed(!isCollapsed)}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <Text className="font-montserrat-semibold text-lg">
            {title}
          </Text>
          <ChevronsDownUp 
            size={20} 
            className={`transform ${isCollapsed ? 'rotate-180' : 'rotate-0'} text-black`}
          />
        </View>
        <View className="flex-row items-center gap-2">
          <View className="px-2 py-1 rounded-0.5 bg-orange-soft">
            <Text className="font-montserrat-medium text-xxs text-orange-hard">
              L-{leetcodeId}
            </Text>
          </View>
          <View className="px-2 py-1 rounded-0.5 bg-green-soft">
            <Text className="font-montserrat-medium text-xxs text-green-hard">
              Easy
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View className="mt-4">
          <Text className="font-montserrat-regular text-base text-gray-700 mb-4">
            {description}
          </Text>

          {constraints.length > 0 && (
            <View>
              <Text className="font-montserrat-regular text-sm text-gray-800 mb-2">
                Constraints:
              </Text>
              {constraints.map((constraint, index) => (
                <Text 
                  key={index} 
                  className="font-montserrat-regular text-sm text-gray-700 ml-4"
                >
                  • {constraint}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
