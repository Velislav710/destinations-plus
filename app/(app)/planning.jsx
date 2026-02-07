import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function Planning() {
  const router = useRouter();
  const { theme } = useTheme();

  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error("LOAD PREF ERROR →", error);
      setLoading(false);
      return;
    }

    setPreferences(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!preferences) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text style={{ color: "red", marginBottom: 12 }}>
          Липсват предпочитания.
        </Text>
        <Pressable onPress={() => router.push("/preferences")}>
          <Text style={{ color: "#1E90FF" }}>Попълни предпочитания</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Планиране" />

      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.text }}>Дни: {preferences.days}</Text>
        <Text style={{ color: theme.text }}>Бюджет: {preferences.budget}</Text>
        <Text style={{ color: theme.text }}>Темпо: {preferences.pace}</Text>

        <Pressable
          style={{
            marginTop: 30,
            backgroundColor: "#1E90FF",
            padding: 16,
            borderRadius: 20,
          }}
          onPress={() => router.push("/route")}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Генерирай маршрут
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
