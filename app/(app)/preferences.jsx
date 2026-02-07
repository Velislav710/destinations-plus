import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const CATEGORY_OPTIONS = [
  { key: "cultural", label: "Култура" },
  { key: "historic", label: "Исторически" },
  { key: "architecture", label: "Архитектура" },
  { key: "nature", label: "Природа" },
  { key: "food", label: "Храна" },
];

const TRANSPORT_OPTIONS = [
  { key: "walk", label: "Пеша" },
  { key: "car", label: "Кола" },
  { key: "public", label: "Градски транспорт" },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("medium");
  const [pace, setPace] = useState("normal");
  const [radius, setRadius] = useState("5000");

  const [categories, setCategories] = useState([]);
  const [transport, setTransport] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function toggleItem(list, setList, value) {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  }

  async function savePreferences() {
    setError(null);

    if (!days || Number(days) < 1) {
      setError("Моля, въведи валиден брой дни.");
      return;
    }

    if (categories.length === 0) {
      setError("Избери поне една категория.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Потребителят не е логнат.");
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      days: Number(days),
      budget,
      pace,
      radius: Number(radius),
      categories,
      transport,
      created_at: new Date().toISOString(),
    };

    console.log("INSERT PREFERENCES →", payload);

    const { error: insertError } = await supabase
      .from("user_preferences")
      .insert(payload);

    if (insertError) {
      console.error(insertError);
      setError("Грешка при запис в базата.");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/planning");
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Предпочитания" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* DAYS */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Брой дни</Text>
          <TextInput
            value={days}
            onChangeText={setDays}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.text }]}
          />
        </View>

        {/* BUDGET */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Бюджет</Text>
          <View style={styles.row}>
            {["low", "medium", "high"].map((b) => (
              <Pressable
                key={b}
                onPress={() => setBudget(b)}
                style={[styles.chip, budget === b && styles.chipActive]}
              >
                <Text style={styles.chipText}>
                  {b === "low" ? "Нисък" : b === "medium" ? "Среден" : "Висок"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* PACE */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Темпо</Text>
          <View style={styles.row}>
            {["slow", "normal", "fast"].map((p) => (
              <Pressable
                key={p}
                onPress={() => setPace(p)}
                style={[styles.chip, pace === p && styles.chipActive]}
              >
                <Text style={styles.chipText}>
                  {p === "slow"
                    ? "Бавно"
                    : p === "normal"
                      ? "Нормално"
                      : "Бързо"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* RADIUS */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>
            Радиус (метри)
          </Text>
          <TextInput
            value={radius}
            onChangeText={setRadius}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.text }]}
          />
        </View>

        {/* CATEGORIES */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Категории</Text>
          <View style={styles.rowWrap}>
            {CATEGORY_OPTIONS.map((c) => (
              <Pressable
                key={c.key}
                onPress={() => toggleItem(categories, setCategories, c.key)}
                style={[
                  styles.chip,
                  categories.includes(c.key) && styles.chipActive,
                ]}
              >
                <Text style={styles.chipText}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* TRANSPORT */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Транспорт</Text>
          <View style={styles.rowWrap}>
            {TRANSPORT_OPTIONS.map((t) => (
              <Pressable
                key={t.key}
                onPress={() => toggleItem(transport, setTransport, t.key)}
                style={[
                  styles.chip,
                  transport.includes(t.key) && styles.chipActive,
                ]}
              >
                <Text style={styles.chipText}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && (
          <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
        )}

        <Pressable
          style={styles.saveButton}
          onPress={savePreferences}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Записване..." : "Продължи към планиране"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#1E90FF",
  },
  chipText: {
    color: "#000",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
