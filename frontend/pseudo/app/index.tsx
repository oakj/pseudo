import { Redirect } from "expo-router";

console.log('========= INDEX FILE IS BEING PROCESSED =========');

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}