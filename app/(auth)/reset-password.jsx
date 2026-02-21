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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 25,
        backgroundColor: theme.bg,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          color: theme.text,
        }}
      >
        Нова парола
      </Text>

      <Text
        style={{
          marginBottom: 25,
          color: theme.text,
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
        disabled={!sessionReady}
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
