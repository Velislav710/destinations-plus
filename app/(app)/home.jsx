import { useRouter } from "expo-router";
import { generateSmartRoute } from "../../lib/services/routeService";

import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

/**
 * ===============================
 * MAP STYLING
 * ===============================
 */
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

/**
 * ===============================
 * HOME SCREEN
 * ===============================
 */
export default function Home() {
  const router = useRouter();
  const { theme, mode } = useTheme();

  /**
   * ===============================
   * SAFE DEFAULT PREFERENCES
   * (🔥 ключово за да НЕ крашва)
   * ===============================
   */
  const preferences = useMemo(
    () => ({
      categories: ["cultural", "historic", "architecture"],
      radius: 5000,
    }),
    [],
  );

  /**
   * ===============================
   * STATE
   * ===============================
   */
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planning, setPlanning] = useState(false);

  /**
   * ===============================
   * LOAD LOCATION
   * ===============================
   */
  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      try {
        const loc = await getCurrentLocation();

        if (!mounted) return;

        if (!loc?.latitude || !loc?.longitude) {
          throw new Error("Невалидна локация");
        }

        setLocation(loc);
      } catch (err) {
        console.error("LOCATION ERROR →", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadLocation();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * ===============================
   * PLAN ROUTE
   * ===============================
   */
  async function handlePlanRoute() {
    if (!location) {
      Alert.alert("Грешка", "Няма текуща локация");
      return;
    }

    if (!preferences?.categories?.length) {
      Alert.alert("Грешка", "Липсват предпочитания");
      return;
    }

    setPlanning(true);

    try {
      console.log("PLANNING WITH →", {
        location,
        preferences,
      });

      const result = await generateSmartRoute({
        location,
        preferences,
      });

      console.log("ROUTE RESULT →", result);

      if (!result || !Array.isArray(result.route)) {
        throw new Error("Невалиден маршрут");
      }

      router.push({
        pathname: "/route",
        params: {
          route: JSON.stringify(result.route),
        },
      });
    } catch (e) {
      console.error("ROUTE ERROR →", e);
      Alert.alert("Грешка", "Не успяхме да създадем маршрут. Опитай отново.");
    } finally {
      setPlanning(false);
    }
  }

  /**
   * ===============================
   * LOADING STATE
   * ===============================
   */
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

  /**
   * ===============================
   * ERROR STATE
   * ===============================
   */
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  /**
   * ===============================
   * MAIN UI
   * ===============================
   */
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
          coordinate={location}
          title="Ти си тук"
          description="Начална точка"
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
        disabled={!location || planning}
        style={[
          styles.planButton,
          { opacity: location && !planning ? 1 : 0.5 },
        ]}
        onPress={handlePlanRoute}
      >
        <Text style={styles.planText}>
          {planning ? "Планиране…" : "Планирай маршрут"}
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * ===============================
 * STYLES
 * ===============================
 */
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
