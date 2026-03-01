import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react"; // <-- Добавихме useEffect
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true); // По подразбиране е true
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // --- НОВА ЛОГИКА: ЗАРЕЖДАНЕ НА ЗАПАЗЕНИ ДАННИ ---
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        // 1. Взимаме запаметения статус на "Запомни ме"
        const savedRemember = await AsyncStorage.getItem("rememberMe");

        // Ако е било true, зареждаме и имейла
        if (savedRemember === "true") {
          const savedEmail = await AsyncStorage.getItem("savedEmail");
          if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
          }
        } else {
          // Ако не е било true, уверяваме се, че чекбоксът е махнат
          setRemember(false);
        }
      } catch (e) {
        console.log("Грешка при зареждане на данни", e);
      }
    };

    loadSavedCredentials();
  }, []);
  // ------------------------------------------------

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Грешка", "Попълнете всички полета.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // --- НОВА ЛОГИКА: ЗАПАЗВАНЕ НА ДАННИ ---
      if (remember) {
        // Ако е чекнато, запазваме статуса и имейла
        await AsyncStorage.setItem("rememberMe", "true");
        await AsyncStorage.setItem("savedEmail", email);
      } else {
        // Ако не е чекнато, изтриваме всичко
        await AsyncStorage.removeItem("rememberMe");
        await AsyncStorage.removeItem("savedEmail");
      }
      // ----------------------------------------

      router.replace("/home");
    } catch (err) {
      Alert.alert("Грешка", "Невалиден имейл или парола.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      const redirectTo = makeRedirectUri({
        scheme: "destinationsplus",
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) throw error;

      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        router.replace("/home");
      }
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR →", err);
      Alert.alert("Грешка", "Проблем при вход с Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Вход" />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 25,
        }}
      >
        {/* ЛОГО */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Ionicons name="earth" size={60} color="#1E90FF" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.text,
              marginTop: 10,
            }}
          >
            ДестинацииПлюс
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
            marginBottom: 10,
          }}
        />

        {/* REMEMBER ME */}
        <Pressable
          onPress={() => setRemember(!remember)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons
            name={remember ? "checkbox" : "square-outline"}
            size={20}
            color="#1E90FF"
          />
          <Text
            style={{
              marginLeft: 8,
              color: theme.text,
            }}
          >
            Запомни ме
          </Text>
        </Pressable>

        {/* LOGIN BUTTON */}
        <Pressable
          style={{
            backgroundColor: "#1E90FF",
            padding: 16,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 15,
          }}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Вход</Text>
          )}
        </Pressable>

        {/* GOOGLE LOGIN */}
        <Pressable
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 15,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          onPress={handleGoogleLogin}
        >
          {googleLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              Вход с Google
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/forgot-password")}>
          <Text
            style={{
              textAlign: "center",
              color: "#1E90FF",
              marginBottom: 10,
            }}
          >
            Забравена парола?
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text
            style={{
              textAlign: "center",
              color: theme.text,
            }}
          >
            Нямаш акаунт? Регистрация
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
