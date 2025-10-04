import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { Image, View, Animated, Easing } from "react-native";
import styled from "styled-components/native";
import { TodoListScreen } from "./src/screens/TodoListScreen";
import { AddTaskScreen } from "./src/screens/AddTaskScreen";
import { useTaskStore } from "./src/store/taskStore";
import { useColors } from "./src/theme/color";

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const SPLASH_IMAGE = require("./assets/app-icon.png");

const Stack = createStackNavigator();

const SplashContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${(props: any) => props.color};
`;

const SplashText = styled.Text`
  font-size: 35px;
  color: white;
  font-weight: bold;
  margin-left: 20px;
  letter-spacing: 2px;
`;

function SplashScreenComponent({
  color,
  fadeAnim,
}: {
  color: string;
  fadeAnim: Animated.Value;
}) {
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <SplashContainer color={color}>
        <Image
          source={SPLASH_IMAGE}
          style={{ width: 30, height: 30, resizeMode: "contain" }}
          accessibilityLabel="App Logo Splash Screen"
        />
        <SplashText>Tasks</SplashText>
      </SplashContainer>
    </Animated.View>
  );
}

function App() {
  const colors = useColors();
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const fadeAnim = new Animated.Value(1); // Initial opacity: 1 (fully visible)

  // Simulate app loading (e.g., hydrating Zustand store)
  useEffect(() => {
    async function prepare() {
      try {
        // Hide the native Expo splash so our React-based splash shows instead
        await SplashScreen.hideAsync();
        // Keep splash screen visible while loading
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading time
        // Hydrate store or perform other initialization if needed
        // Example: await useTaskStore.persist.rehydrate();
      } catch (e) {
        console.warn(e);
      } finally {
        // Fade out the splash screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, 
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          setIsLoadingComplete(true);
        });
      }
    }
    prepare();
  }, [fadeAnim]);

  if (!isLoadingComplete) {
    return <SplashScreenComponent color={colors.primary} fadeAnim={fadeAnim} />; 
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
