import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../lib/theme";
// Ако използвате AsyncStorage за сесия:
// import AsyncStorage from "@react-native-async-storage/async-storage";

function CustomDrawerContent(props) {
  const { theme, logout } = useTheme(); // Извличаме logout функцията от контекста

  const handleLogout = async () => {
    try {
      // 1. Ако имате специфична logout функция в контекста, я извикайте
      if (logout) {
        await logout();
      }

      // 2. Ако просто трябва да изчистите локалното състояние ръчно:
      // await AsyncStorage.removeItem("userToken");

      // 3. Пренасочване към началния (login) екран
      // Използваме replace, за да не може потребителят да се върне назад с бутона "Back"
      router.replace("/");
    } catch (error) {
      console.error("Грешка при изход:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.card }}>
      {/* Рендерира стандартните екрани (Начало, Планиране...) */}
      <DrawerItemList {...props} />

      {/* Бутон за Изход */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: theme.primary + "20" },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: theme.primary }]}>
            Изход 🚪
          </Text>
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
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,
      }}
    >
      <Drawer.Screen name="home" options={{ title: "Начало  🏠︎" }} />
      <Drawer.Screen name="planning" options={{ title: "Планиране 🧭" }} />
      <Drawer.Screen
        name="preferences"
        options={{ title: "Предпочитания  🎯" }}
      />
      <Drawer.Screen name="route" options={{ title: "Маршрут  🗺️" }} />
      <Drawer.Screen
        name="feedback"
        options={{ title: "Обратна връзка  📩" }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#cccccc50",
    paddingTop: 20,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
