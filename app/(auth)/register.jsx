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

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Грешка", "Попълнете всички полета.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert("Успешно", "Провери имейла си за потвърждение.");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Грешка", "Проблем при регистрация.");
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

      {/* HEADER */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Ionicons name="person-add-outline" size={60} color="#1E90FF" />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text,
            marginTop: 10,
          }}
        >
          Създай акаунт
        </Text>
      </View>

      <TextInput
        placeholder="Имейл"
        placeholderTextColor={theme.subText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: theme.card,
          padding: 15,
          borderRadius: 20,
          color: theme.text,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Парола"
        placeholderTextColor={theme.subText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: theme.card,
          padding: 15,
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
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Регистрация</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text
          style={{
            textAlign: "center",
            color: theme.text,
          }}
        >
          Вече имаш акаунт? Вход
        </Text>
      </Pressable>
    </View>
  );
}
