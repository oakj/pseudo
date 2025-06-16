import { Redirect } from "expo-router";
import { useAuth } from "./contexts/AuthContext";

console.log('========= INDEX FILE IS BEING PROCESSED =========');

export default function Index() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to the appropriate screen based on auth state
  return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/(auth)/login"} />;
}