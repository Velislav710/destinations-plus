import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import AppHeader from "../../components/AppHeader";
import { getCurrentLocation } from "../../lib/location";
import { useTheme } from "../../lib/theme";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0B1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#CBD5E1" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1220" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },
];

export default function Home() {
  const router = useRouter();
  const { theme, mode } = useTheme();

  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // LOAD LOCATION (SAFE)
  // =========================
  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      try {
        const loc = await getCurrentLocation();
        if (mounted) {
          setLocation(loc);
        }
      } catch (err) {
        if (mounted) {
          setError("Неуспешно взимане на локация");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLocation();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // PLAN ROUTE (NO LOGIC YET)
  // =========================
  function handlePlanRoute() {
    if (!location) return;

    // ❗ НИКАКВА логика тук
    // ❗ Само навигация
    router.push("/preferences");
  }

  // =========================
  // STATES
  // =========================
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 12, color: theme.text }}>
          Определяне на локация…
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

  if (!location) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>Няма налична локация</Text>
      </View>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Начало" />

      <MapView
        style={{ flex: 1 }}
        customMapStyle={mode === "dark" ? DARK_MAP_STYLE : []}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Ти си тук"
        />
      </MapView>

      <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Въведи дестинация (по избор)"
          placeholderTextColor="#999"
          value={destination}
          onChangeText={setDestination}
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      <Pressable
        disabled={!location}
        style={[styles.planButton, { opacity: location ? 1 : 0.5 }]}
        onPress={handlePlanRoute}
      >
        <Text style={styles.planText}>Планирай маршрут</Text>
      </Pressable>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBox: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
  },
  input: {
    fontSize: 16,
  },
  planButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1E90FF",
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 32,
    elevation: 4,
  },
  planText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
