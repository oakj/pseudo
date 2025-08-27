import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { ChevronsDownUp } from '../../lib/icons/ChevronsDownUp';
import { useState } from 'react';
import { cn } from '~/app/lib/utils';

interface QuestionDescriptionProps {
  title: string;
  description: string;
  constraints: string[];
  difficulty: string;
}

export function QuestionDescription({ title, description, constraints, difficulty }: QuestionDescriptionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Format the difficulty text properly
  const formattedDifficulty = difficulty 
    ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase() 
    : 'Easy';
  
  // Get badge colors based on difficulty
  const getBadgeColors = () => {
    const difficultyLower = difficulty?.toLowerCase() || 'easy';
    
    switch(difficultyLower) {
      case 'medium':
        return 'bg-orange-soft text-default';
      case 'hard':
        return 'bg-red-soft text-default';
      case 'easy':
      default:
        return 'bg-green-soft text-default';
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <TouchableOpacity 
        onPress={() => setIsCollapsed(!isCollapsed)}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <Text className="font-montserrat-semibold text-lg">
            {title}
          </Text>
          {/* Custom badge implementation */}
          <View className={`px-2 py-1 rounded-full ${getBadgeColors()}`}>
            <Text className="font-montserrat-medium text-xs">
              {formattedDifficulty}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <ChevronsDownUp 
            size={20} 
            className={`transform ${isCollapsed ? 'rotate-180' : 'rotate-0'} text-black`}
          />
        </View>
      </TouchableOpacity>

      {/* Rest of component remains the same */}
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
