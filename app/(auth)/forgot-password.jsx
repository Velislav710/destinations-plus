import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import ThemeToggle from "../../components/ThemeToggle";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Грешка", "Моля въведете имейл адрес.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "destinationsplus://reset-password",
      });

      if (error) throw error;

      Alert.alert(
        "Успешно",
        "Изпратихме линк за възстановяване на паролата на вашия имейл.",
      );

      router.push("/login");
    } catch (err) {
      console.log("RESET ERROR →", err);
      Alert.alert("Грешка", "Възникна проблем при изпращане на имейла.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 25,
        backgroundColor: theme.bg,
      }}
    >
      {/* THEME TOGGLE */}
      <View style={{ position: "absolute", top: 50, right: 25 }}>
        <ThemeToggle />
      </View>

      {/* HEADER ICON */}
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Ionicons name="key-outline" size={60} color="#1E90FF" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme.text,
            marginTop: 10,
          }}
        >
          Забравена парола
        </Text>
      </View>

      <Text
        style={{
          marginBottom: 25,
          color: "gray",
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        Въведете своя имейл адрес. Ще получите линк за възстановяване на
        паролата.
      </Text>

      <TextInput
        placeholder="Имейл"
        placeholderTextColor={theme.subText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: theme.card,
          padding: 16,
          borderRadius: 20,
          color: theme.text,
          marginBottom: 20,
        }}
      />

      <Pressable
        style={{
          backgroundColor: "#1E90FF",
          padding: 16,
          borderRadius: 25,
          alignItems: "center",
          marginBottom: 15,
        }}
        onPress={handleReset}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Изпрати линк
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text
          style={{
            textAlign: "center",
            color: "#1E90FF",
          }}
        >
          Обратно към вход
        </Text>
      </Pressable>
    </View>
  );
}
