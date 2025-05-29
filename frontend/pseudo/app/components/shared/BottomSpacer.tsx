import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomSpacer = () => {
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = 49; // Standard tab bar height

  return (
    <View style={{ height: TAB_HEIGHT + insets.bottom }} />
  );
};