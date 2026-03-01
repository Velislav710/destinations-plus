import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function ResetPassword() {
  const router = useRouter();
  const { theme } = useTheme();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    handleDeepLink();
  }, []);

  async function handleDeepLink() {
    const url = await Linking.getInitialURL();
    if (!url) return;

    const { queryParams } = Linking.parse(url);

    if (queryParams?.access_token && queryParams?.refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token: queryParams.access_token,
        refresh_token: queryParams.refresh_token,
      });

      if (!error) {
        setSessionReady(true);
      } else {
        Alert.alert("Грешка", "Невалиден или изтекъл линк.");
        router.replace("/login");
      }
    }
  }

  async function handleUpdatePassword() {
    if (!password || password.length < 6) {
      Alert.alert("Грешка", "Паролата трябва да бъде минимум 6 символа.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      Alert.alert("Успешно", "Паролата беше сменена успешно.");
      router.replace("/login");
    } catch (err) {
      console.log("UPDATE ERROR →", err);
      Alert.alert("Грешка", "Неуспешна смяна на паролата.");
    } finally {
      setLoading(false);
    }
  }

  // Докато чакаме session
  if (!sessionReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.bg,
        }}
      >
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 15, color: theme.text }}>
          Проверка на линка...
        </Text>
      </View>
    );
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
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Ionicons name="lock-closed-outline" size={60} color="#1E90FF" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme.text,
            marginTop: 10,
          }}
        >
          Нова парола
        </Text>
      </View>

      <Text
        style={{
          marginBottom: 25,
          color: theme.subText,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        Въведете новата си парола.
      </Text>

      <TextInput
        placeholder="Нова парола"
        placeholderTextColor={theme.subText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
        }}
        onPress={handleUpdatePassword}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Смени паролата
          </Text>
        )}
      </Pressable>
    </View>
  );
}
