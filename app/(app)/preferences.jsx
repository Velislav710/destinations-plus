import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const CATEGORIES = [
  { key: "cultural", label: "🎭 Култура" },
  { key: "historic", label: "🏛 История" },
  { key: "architecture", label: "🏗 Архитектура" },
  { key: "nature", label: "🌲 Природа" },
  { key: "food", label: "🍽 Храна" },
  { key: "nightlife", label: "🌙 Нощен живот" },
];

const TRANSPORTS = [
  { key: "walk", label: "🚶 Пеша" },
  { key: "car", label: "🚗 Кола" },
  { key: "public", label: "🚌 Градски транспорт" },
];

const PACES = [
  { key: "slow", label: "Спокойно" },
  { key: "normal", label: "Нормално" },
  { key: "fast", label: "Интензивно" },
];

export default function Preferences() {
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [transport, setTransport] = useState([]);
  const [pace, setPace] = useState("normal");

  const [days, setDays] = useState("2");
  const [budget, setBudget] = useState("medium");
  const [radius, setRadius] = useState("5"); // км

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setCategories(data.categories || []);
      setTransport(data.transport || []);
      setPace(data.pace || "normal");
      setDays(String(data.days || 2));
      setBudget(data.budget || "medium");
      setRadius(String((data.radius || 5000) / 1000));
    }

    setLoading(false);
  }

  function toggle(setter, value) {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleSave() {
    if (categories.length === 0) {
      alert("Избери поне една категория");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("preferences").upsert({
      user_id: user.id,
      categories,
      transport,
      pace,
      days: Number(days),
      budget,
      radius: Number(radius) * 1000,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    router.push("/planning");
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Предпочитания" />

      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Интереси">
          <Grid>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                active={categories.includes(c.key)}
                onPress={() => toggle(setCategories, c.key)}
              />
            ))}
          </Grid>
        </Section>

        <Section title="Дни за пътуване">
          <TextInput
            value={days}
            onChangeText={setDays}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.text }]}
          />
        </Section>

        <Section title="Бюджет">
          <Grid>
            {["low", "medium", "high"].map((b) => (
              <Chip
                key={b}
                label={
                  b === "low"
                    ? "💸 Нисък"
                    : b === "medium"
                      ? "💰 Среден"
                      : "💎 Висок"
                }
                active={budget === b}
                onPress={() => setBudget(b)}
              />
            ))}
          </Grid>
        </Section>

        <Section title="Темпо">
          <Grid>
            {PACES.map((p) => (
              <Chip
                key={p.key}
                label={p.label}
                active={pace === p.key}
                onPress={() => setPace(p.key)}
              />
            ))}
          </Grid>
        </Section>

        <Section title="Радиус от мястото (км)">
          <TextInput
            value={radius}
            onChangeText={setRadius}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.text }]}
          />
        </Section>

        <Section title="Транспорт">
          <Grid>
            {TRANSPORTS.map((t) => (
              <Chip
                key={t.key}
                label={t.label}
                active={transport.includes(t.key)}
                onPress={() => toggle(setTransport, t.key)}
              />
            ))}
          </Grid>
        </Section>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Продължи към планиране</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Grid({ children }) {
  return <View style={styles.grid}>{children}</View>;
}

function Chip({ label, active, onPress }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? "#1E90FF" : theme.card },
      ]}
    >
      <Text style={{ color: active ? "#fff" : theme.text }}>{label}</Text>
    </Pressable>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  input: {
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
