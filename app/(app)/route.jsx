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
import { getCurrentLocation } from "../../lib/location";
import { generateSmartRoute } from "../../lib/services/routeService";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function RouteScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [preferences, setPreferences] = useState(null);
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===============================
     LOAD LOCATION + PREFERENCES
  =============================== */
  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Location
        const loc = await getCurrentLocation();
        setLocation(loc);

        // 2. Preferences
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .single();

        if (error || !data) {
          setPreferences(null);
        } else {
          setPreferences(data);
        }
      } catch (e) {
        setError("Грешка при зареждане на данни.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  /* ===============================
     PLAN ROUTE (ONLY IF READY)
  =============================== */
  useEffect(() => {
    if (!location || !preferences || !preferences.categories?.length) return;

    async function planRoute() {
      try {
        const result = await generateSmartRoute({
          location,
          preferences,
        });

        setRoute(result);
      } catch (e) {
        setError("Грешка при планиране на маршрута.");
        console.error("ROUTE ERROR →", e);
      }
    }

    planRoute();
  }, [location, preferences]);

  /* ===============================
     UI STATES
  =============================== */

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 12, color: theme.text }}>
          Планираме маршрута ти…
        </Text>
      </View>
    );
  }

  if (!preferences || !preferences.categories?.length) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText]}>
          Липсват предпочитания. Моля, попълни ги.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/preferences")}
        >
          <Text style={styles.buttonText}>Попълни предпочитания</Text>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText]}>{error}</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>
          Изчисляваме оптималния маршрут…
        </Text>
      </View>
    );
  }

  /* ===============================
     SUCCESS VIEW
  =============================== */
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Твоят маршрут" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Програма
        </Text>

        {route.days?.map((day, index) => (
          <View
            key={index}
            style={[styles.dayCard, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.dayTitle, { color: theme.text }]}>
              Ден {index + 1}
            </Text>

            {day.places.map((place, i) => (
              <Text key={i} style={{ color: theme.text }}>
                • {place.name}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ===============================
   STYLES
=============================== */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  dayCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
