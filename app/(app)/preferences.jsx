import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function Preferences() {
  const router = useRouter();
  const { theme } = useTheme();

  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("medium");
  const [pace, setPace] = useState("normal");
  const [radius, setRadius] = useState("5000");

  const [categories, setCategories] = useState([
    "cultural",
    "historic",
    "architecture",
  ]);

  const [transport, setTransport] = useState(["walk"]);

  async function handleContinue() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Грешка", "Няма логнат потребител");
      return;
    }

    // 🔒 ВАЛИДАЦИЯ
    if (!days || !radius || categories.length === 0 || transport.length === 0) {
      Alert.alert("Грешка", "Моля, попълни всички предпочитания");
      return;
    }

    const payload = {
      user_id: user.id,
      categories,
      days: Number(days),
      budget,
      pace,
      radius: Number(radius),
      transport,
    };

    console.log("INSERT PREFERENCES →", payload);

    const { error } = await supabase.from("user_preferences").insert(payload);

    if (error) {
      console.error("SUPABASE INSERT ERROR →", error);
      Alert.alert("DB грешка", error.message);
      return;
    }

    // 👉 УСПЕХ
    router.push("/planning");
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <AppHeader title="Предпочитания" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.text }]}>Брой дни</Text>
        <TextInput
          value={days}
          onChangeText={setDays}
          keyboardType="numeric"
          style={[styles.input, { color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>Бюджет</Text>
        <TextInput
          value={budget}
          onChangeText={setBudget}
          style={[styles.input, { color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>Темпо</Text>
        <TextInput
          value={pace}
          onChangeText={setPace}
          style={[styles.input, { color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Радиус (в метри)
        </Text>
        <TextInput
          value={radius}
          onChangeText={setRadius}
          keyboardType="numeric"
          style={[styles.input, { color: theme.text }]}
        />

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Продължи към планиране</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#1E90FF",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
