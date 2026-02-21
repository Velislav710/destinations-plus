import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: theme.bg,
        }}
      >
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
      <AppHeader title="Планиране на маршрут" />

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ОБОБЩЕНИЕ */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 18,
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 12,
            }}
          >
            Твоите предпочитания
          </Text>

          <Text style={{ color: theme.text, marginBottom: 6 }}>
            📅 Дни: {preferences.days}
          </Text>

          <Text style={{ color: theme.text, marginBottom: 6 }}>
            💰 Бюджет: {preferences.budget}
          </Text>

          <Text style={{ color: theme.text, marginBottom: 6 }}>
            🚶 Темпо: {preferences.pace}
          </Text>

          <Text style={{ color: theme.text }}>
            🏛 Категории: {preferences.categories.join(", ")}
          </Text>
        </View>

        {/* ОБЯСНЕНИЕ ЗА РЕЙТИНГИТЕ */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 18,
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Как се избират забележителностите?
          </Text>

          <Text style={{ color: theme.text, lineHeight: 20 }}>
            Системата използва Google Places API, което означава, че
            забележителностите са с реални потребителски оценки и рейтинги. AI
            алгоритъмът подбира най-подходящите обекти според:
          </Text>

          <Text style={{ color: theme.text, marginTop: 8 }}>
            • Потребителски рейтинг
          </Text>
          <Text style={{ color: theme.text }}>• Популярност и значимост</Text>
          <Text style={{ color: theme.text }}>
            • Разстояние от твоята локация
          </Text>
          <Text style={{ color: theme.text }}>
            • Твоите лични предпочитания
          </Text>
        </View>

        {/* ОБЯСНЕНИЕ ЗА AI */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 18,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Как работи маршрутът?
          </Text>

          <Text style={{ color: theme.text, lineHeight: 20 }}>
            След натискане на бутона по-долу, системата:
          </Text>

          <Text style={{ color: theme.text, marginTop: 8 }}>
            • Извлича актуалната ти локация
          </Text>
          <Text style={{ color: theme.text }}>
            • Зарежда туристически обекти от Google
          </Text>
          <Text style={{ color: theme.text }}>
            • Генерира интелигентна програма чрез AI
          </Text>
          <Text style={{ color: theme.text }}>
            • Създава оптимален дневен план
          </Text>
        </View>

        {/* БУТОН */}
        <Pressable
          style={{
            backgroundColor: "#1E90FF",
            padding: 18,
            borderRadius: 25,
            alignItems: "center",
          }}
          onPress={() => router.push("/route")}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Генерирай маршрут
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
