import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

const CATEGORIES = [
  { id: "cultural", label: "Култура" },
  { id: "historic", label: "История" },
  { id: "architecture", label: "Архитектура" },
  { id: "nature", label: "Природа" },
  { id: "food", label: "Храна" },
  { id: "shopping", label: "Пазаруване" },
];

const RADII = [1000, 3000, 5000, 10000];

export default function Preferences() {
  const { theme } = useTheme();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [radius, setRadius] = useState(5000);
  const [loading, setLoading] = useState(true);

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
      .maybeSingle();

    if (data) {
      setSelectedCategories(data.categories);
      setRadius(data.radius);
    }

    setLoading(false);
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function savePreferences() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("preferences").upsert({
      user_id: user.id,
      categories: selectedCategories,
      radius,
    });

    alert("Предпочитанията са запазени ✅");
  }

  if (loading) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <AppHeader title="Предпочитания" />

      <Text style={[styles.section, { color: theme.text }]}>Категории</Text>

      {CATEGORIES.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => toggleCategory(cat.id)}
          style={[
            styles.option,
            {
              backgroundColor: selectedCategories.includes(cat.id)
                ? "#1E90FF"
                : theme.card,
            },
          ]}
        >
          <Text style={{ color: theme.text }}>{cat.label}</Text>
        </Pressable>
      ))}

      <Text style={[styles.section, { color: theme.text }]}>Радиус</Text>

      {RADII.map((r) => (
        <Pressable
          key={r}
          onPress={() => setRadius(r)}
          style={[
            styles.option,
            {
              backgroundColor: radius === r ? "#1E90FF" : theme.card,
            },
          ]}
        >
          <Text style={{ color: theme.text }}>{r / 1000} км</Text>
        </Pressable>
      ))}

      <Pressable style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveText}>Запази</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  section: { fontSize: 18, marginVertical: 12 },
  option: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
