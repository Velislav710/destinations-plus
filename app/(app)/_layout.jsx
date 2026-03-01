import { Drawer } from "expo-router/drawer";
import { useTheme } from "../../lib/theme";

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.card,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,
      }}
    >
      <Drawer.Screen name="home" options={{ title: "Home" }} />
      <Drawer.Screen name="planning" options={{ title: "Planning" }} />
      <Drawer.Screen name="preferences" options={{ title: "Preferences" }} />
      <Drawer.Screen name="route" options={{ title: "Route" }} />
      <Drawer.Screen name="feedback" options={{ title: "Feedback" }} />
    </Drawer>
  );
}
