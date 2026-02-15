import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export default function RouteScreen() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    planRoute();
  }, []);

  async function planRoute() {
    try {
      setLoading(true);
      setError(null);

      // ===============================
      // 1️⃣ ВЗИМАМЕ ПОСЛЕДНИ ПРЕДПОЧИТАНИЯ
      // ===============================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Няма логнат потребител.");

      const { data: preferences, error: prefError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (prefError || !preferences) {
        throw new Error("Липсват предпочитания.");
      }

      console.log("PREFERENCES →", preferences);

      // ===============================
      // 2️⃣ ВЗИМАМЕ ЛОКАЦИЯ
      // ===============================

      const { data: locationData } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("LOCATION FROM DB →", locationData);

      let lat = 42.6977; // София fallback
      let lon = 23.3219;

      if (locationData && locationData.lat && locationData.lon) {
        const parsedLat = parseFloat(locationData.lat);
        const parsedLon = parseFloat(locationData.lon);

        if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
          lat = parsedLat;
          lon = parsedLon;
        }
      }

      console.log("FINAL LOCATION →", { lat, lon });

      // ===============================
      // 3️⃣ GOOGLE PLACES API CALL
      // ===============================

      const radius = preferences.radius || 5000;

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=tourist_attraction&key=${GOOGLE_API_KEY}`;

      console.log("GOOGLE URL →", url);

      const response = await fetch(url);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          `Google Places error: ${json.error_message || response.status}`,
        );
      }

      if (!json.results) {
        throw new Error("Google не върна резултати.");
      }

      console.log("GOOGLE RESULTS COUNT →", json.results.length);

      setPlaces(json.results.slice(0, 10));
    } catch (err) {
      console.log("ROUTE ERROR →", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Генерирам маршрут...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Твоят маршрут</Text>

      {places.map((place, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text>⭐ {place.rating || "Няма рейтинг"}</Text>
          <Text>{place.vicinity}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 15,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "600",
  },
});
