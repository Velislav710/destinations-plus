import { Text, View } from "react-native";
import { useTheme } from "../lib/theme";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader({ title }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.card,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme.text,
        }}
      >
        {title}
      </Text>

      <ThemeToggle />
    </View>
  );
}
