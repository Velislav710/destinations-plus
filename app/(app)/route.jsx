import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { generateSmartRoute } from "../../lib/services/routeService";

import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function RouteScreen() {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    async function planRoute() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Няма логнат потребител");
        }

        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!preferences) {
          throw new Error("Липсват предпочитания");
        }

        const { data: locationRow } = await supabase
          .from("user_locations")
          .select("latitude, longitude")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!locationRow) {
          throw new Error("Липсва локация");
        }

        const result = await generateSmartRoute({
          location: {
            latitude: locationRow.latitude,
            longitude: locationRow.longitude,
          },
          preferences,
        });

        setRoute(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    planRoute();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: theme.text, marginTop: 12 }}>
          Генериране на маршрут…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Твоят маршрут" />

      <ScrollView style={{ padding: 16 }}>
        {route?.days?.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayTitle}>Ден {index + 1}</Text>
            <Text style={styles.dayText}>{day.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCard: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#38BDF8",
    marginBottom: 6,
  },
  dayText: {
    color: "#E5E7EB",
    fontSize: 15,
  },
});
