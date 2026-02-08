import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { generateAIItinerary } from "../../lib/ai/openaiPlanner";
import { getPlacesNearby } from "../../lib/apis/opentripmap";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function RouteScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState(null);

  useEffect(() => {
    planRoute();
  }, []);

  async function planRoute() {
    try {
      setLoading(true);
      setError(null);

      //Взимаме текущия потребител
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Няма активен потребител");
      }

      //Взимаме ПОСЛЕДНИТЕ предпочитания
      const { data: preferences, error: prefError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (prefError || !preferences) {
        throw new Error("Липсват предпочитания. Моля, попълни ги.");
      }

      //Взимаме последната записана локация
      const { data: locationRow, error: locationError } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (locationError || !locationRow) {
        throw new Error("Липсва локация");
      }

      const location = {
        lat: Number(locationRow.latitude),
        lon: Number(locationRow.longitude),
      };

      if (Number.isNaN(location.lat) || Number.isNaN(location.lon)) {
        throw new Error("Невалидна локация (lat/lon)");
      }

      console.log("FINAL LOCATION →", location);
      console.log("PREFERENCES →", preferences);

      //OpenTripMap – взимаме реални места
      const places = await getPlacesNearby({
        lat: location.lat,
        lon: location.lon,
        radius: preferences.radius || 5000, // метри
        categories: preferences.categories,
        limit: 30,
      });

      if (!places || places.length === 0) {
        throw new Error("Не бяха намерени забележителности");
      }

      //OpenAI – генерираме програма
      const aiProgram = await generateAIItinerary({
        city: locationRow.city || "текущия град",
        days: preferences.days,
        preferences,
        places,
      });

      setProgram(aiProgram);
    } catch (err) {
      console.error("ROUTE ERROR →", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 12 }}>Генериране на маршрут...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/preferences")}
        >
          <Text style={styles.buttonText}>Попълни предпочитания</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Твоята програма" />

      <ScrollView contentContainerStyle={styles.container}>
        {program?.days?.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayTitle}>Ден {index + 1}</Text>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  dayCard: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  dayText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
