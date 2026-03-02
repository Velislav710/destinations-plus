import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../lib/theme";

function CustomDrawerContent(props) {
  const { theme, logout } = useTheme();

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      router.replace("/");
    } catch (error) {
      console.error("Грешка при изход:", error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: theme.card }}
    >
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Ionicons name="airplane" size={28} color={theme.primary} />
        <Text style={[styles.appTitle, { color: theme.text }]}>
          ДестинацииПлюс
        </Text>
      </View>

      {/* MENU ITEMS */}
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      {/* LOGOUT BUTTON */}
      <View style={[styles.footerContainer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.primary }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#ffffff" />
          <Text style={[styles.logoutText, { color: "#ffffff" }]}>Изход</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.card,
          width: 270,
        },
        drawerActiveBackgroundColor: theme.primary,
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: theme.text,
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Начало",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="planning"
        options={{
          title: "Планиране",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="preferences"
        options={{
          title: "Предпочитания",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="route"
        options={{
          title: "Маршрут",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="feedback"
        options={{
          title: "Обратна връзка",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
