import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Pressable onPress={toggleTheme}>
      <View
        style={{
          width: 50,
          height: 28,
          borderRadius: 20,
          backgroundColor: isDark ? "#333" : "#ddd",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: isDark ? "#1E90FF" : "#fff",
            alignSelf: isDark ? "flex-end" : "flex-start",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={14}
            color={isDark ? "#fff" : "#FFA500"}
          />
        </View>
      </View>
    </Pressable>
  );
}
