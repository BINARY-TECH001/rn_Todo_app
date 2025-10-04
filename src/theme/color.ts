import { useColorScheme } from "react-native";

export function useColors() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return {
    background: isDark ? "#1E1E1E" : "#F0F4F8",
    card: isDark ? "#2A2A2A" : "#FFFFFF",
    text: isDark ? "#E0E0E0" : "#333333",
    secondaryText: isDark ? "#A0A0A0" : "#666666",
    primary: "#6B5B95",
    accent: isDark ? "#8A79B5" : "#7C6AA6",
    border: isDark ? "#404040" : "#E0E0E0",
    completed: isDark ? "#4CAF50" : "#4CAF50",
  };
}
