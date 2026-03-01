import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../lib/theme";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader({ title }) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  function openMenu() {
    if (navigation.getState()?.type === "drawer") {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }

  const isDrawerScreen = navigation.getState()?.type === "drawer";

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
      {/* Hamburger само ако сме в Drawer */}
      {isDrawerScreen ? (
        <Pressable onPress={openMenu}>
          <Ionicons name="menu-outline" size={24} color={theme.text} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}

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
