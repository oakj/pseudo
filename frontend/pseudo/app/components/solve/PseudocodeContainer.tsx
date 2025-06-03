import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { useState } from 'react';
import { cn } from '~/app/lib/utils';
import { AArrowUp } from '~/app/lib/icons/AArrowUp';
import { AArrowDown } from '~/app/lib/icons/AArrowDown';

interface PseudocodeContainerProps {
  boilerplateSolution: string;
}

const fontSizes = ['xxs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const;
type FontSize = typeof fontSizes[number];

export function PseudocodeContainer({ boilerplateSolution }: PseudocodeContainerProps) {
  const [currentFontSizeIndex, setCurrentFontSizeIndex] = useState(3); // Start with 'base'

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

  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4 w-full">
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
        </View>
      </View>
      
      <Text 
        className={cn(
          "font-montserrat-regular text-gray-700 font-mono",
          `text-${fontSizes[currentFontSizeIndex]}`
        )}
      >
        {boilerplateSolution}
      </Text>
    </View>
  );
} 