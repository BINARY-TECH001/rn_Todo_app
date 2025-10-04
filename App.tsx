import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { TodoListScreen } from "./src/screens/TodoListScreen";
import { AddTaskScreen } from "./src/screens/AddTaskScreen";
import { useTaskStore } from "./src/store/taskStore";

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Simulate app loading (e.g., hydrating Zustand store)
  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible while loading
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading time
        // Hydrate store or perform other initialization if needed
        // Example: await useTaskStore.persist.rehydrate();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoadingComplete(true);
        await SplashScreen.hideAsync(); // Hide splash screen once ready
      }
    }
    prepare();
  }, []);

  if (!isLoadingComplete) {
    return null; // Render nothing until loading is complete, splash screen handles this
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TodoList" component={TodoListScreen} />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
