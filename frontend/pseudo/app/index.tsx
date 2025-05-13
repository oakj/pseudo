import { View, Text } from 'react-native';

console.log('========= INDEX FILE IS BEING PROCESSED =========');

export default function Index() {
  console.log('========= INDEX COMPONENT IS RENDERING =========');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Pseudo!</Text>
    </View>
  );
} 