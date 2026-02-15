import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { generateAIItinerary } from "../../lib/ai/openaiPlanner";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export default function RouteScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    planRoute();
  }, []);

  async function planRoute() {
    try {
      setLoading(true);
      setError(null);

      // ===============================
      // 1️⃣ ВЗИМАМЕ USER
      // ===============================
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Няма активен потребител.");

      // ===============================
      // 2️⃣ ВЗИМАМЕ ПОСЛЕДНИ ПРЕДПОЧИТАНИЯ
      // ===============================
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!preferences) {
        throw new Error("Липсват предпочитания.");
      }

      console.log("PREFERENCES →", preferences);

      // ===============================
      // 3️⃣ ВЗИМАМЕ ПОСЛЕДНА ЛОКАЦИЯ
      // ===============================
      const { data: locationData } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let lat = 42.6977; // София fallback
      let lon = 23.3219;

      if (locationData && locationData.latitude && locationData.longitude) {
        lat = parseFloat(locationData.latitude);
        lon = parseFloat(locationData.longitude);
      }

      console.log("FINAL LOCATION →", { lat, lon });

      // ===============================
      // 4️⃣ GOOGLE PLACES
      // ===============================
      const radius = preferences.radius || 5000;

      const googleUrl =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
        `?location=${lat},${lon}` +
        `&radius=${radius}` +
        `&type=tourist_attraction` +
        `&key=${GOOGLE_KEY}`;

      console.log("GOOGLE URL →", googleUrl);

      const response = await fetch(googleUrl);
      const json = await response.json();

      if (json.status !== "OK") {
        throw new Error(`Google Places Error: ${json.status}`);
      }

      const places = json.results.slice(0, 15);

      console.log("GOOGLE RESULTS COUNT →", places.length);

      // ===============================
      // 5️⃣ OPENAI ПЛАНИРАНЕ
      // ===============================
      const aiProgram = await generateAIItinerary({
        city: "София",
        days: preferences.days,
        preferences,
        places,
      });

      setProgram(aiProgram);
    } catch (err) {
      console.log("ROUTE ERROR →", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // UI
  // ===============================

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.text, marginTop: 10 }}>
            Генерираме твоята AI програма...
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={{ color: "red", fontWeight: "bold" }}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.title, { color: theme.text }]}>
            Твоята програма
          </Text>

          <Text style={[styles.programText, { color: theme.text }]}>
            {program}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  programText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
