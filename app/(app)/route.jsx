import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { generateAIItinerary } from "../../lib/ai/openaiPlanner";
import { supabase } from "../../lib/supabase";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export default function Route() {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [plan, setPlan] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [cityName, setCityName] = useState("");
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Няма потребител");

      const { data: pref } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setPreferences(pref);

      const { data: loc } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const coords = {
        lat: loc.latitude,
        lon: loc.longitude,
      };

      setLocation(coords);

      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lon}&key=${GOOGLE_KEY}`,
      );
      const geoData = await geoRes.json();

      const city =
        geoData.results[0]?.address_components.find((c) =>
          c.types.includes("locality"),
        )?.long_name || "Твоят град";

      setCityName(city);

      const placesRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lon}&radius=${pref.radius}&type=tourist_attraction&key=${GOOGLE_KEY}`,
      );

      const placesData = await placesRes.json();
      const results = placesData.results.slice(0, 15);
      setPlaces(results);

      const aiPlan = await generateAIItinerary({
        city,
        days: pref.days,
        preferences: pref,
        places: results,
      });

      setPlan(aiPlan.replace(/\*/g, ""));
    } catch (err) {
      console.log("ROUTE ERROR →", err);
    } finally {
      setLoading(false);
    }
  }

  const theme = darkMode ? darkTheme : lightTheme;

  const splitByDays = () => {
    return plan.split(/Ден\s\d+/).slice(1);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Генериране на твоя маршрут...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.cityTitle, { color: theme.text }]}>
              Маршрут за {cityName}
            </Text>
            <Text style={{ color: theme.subText }}>
              {preferences?.days} дни • {preferences?.pace}
            </Text>
          </View>

          {/* THEME SWITCHER (като home.jsx) */}
          <View style={styles.switchContainer}>
            <Ionicons
              name={darkMode ? "moon" : "sunny"}
              size={18}
              color={theme.text}
              style={{ marginRight: 6 }}
            />
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
              thumbColor="#fff"
              trackColor={{ false: "#ccc", true: "#4F46E5" }}
            />
          </View>
        </View>

        {/* КАРТА */}
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lon,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.geometry.location.lat,
                  longitude: place.geometry.location.lng,
                }}
                title={place.name}
                description={place.vicinity}
              />
            ))}
          </MapView>
        )}

        {/* ПРОГРАМА */}
        <View style={styles.planContainer}>
          {splitByDays().map((dayContent, index) => (
            <View
              key={index}
              style={[styles.dayCard, { backgroundColor: theme.card }]}
            >
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => setOpenDay(openDay === index ? null : index)}
              >
                <Ionicons name="calendar" size={18} color="#4F46E5" />
                <Text style={[styles.dayTitle, { color: theme.text }]}>
                  Ден {index + 1}
                </Text>
                <Ionicons
                  name={openDay === index ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.subText}
                />
              </TouchableOpacity>

              {openDay === index && (
                <Text style={[styles.dayText, { color: theme.text }]}>
                  {dayContent.trim()}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  cityTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  map: {
    height: 260,
    marginHorizontal: 16,
    borderRadius: 20,
  },

  planContainer: {
    padding: 16,
  },

  dayCard: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },

  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  dayTitle: {
    fontWeight: "bold",
    flex: 1,
    marginLeft: 8,
  },

  dayText: {
    marginTop: 10,
    lineHeight: 22,
  },
});

const lightTheme = {
  background: "#FFFFFF",
  text: "#111111",
  subText: "#666666",
  card: "#F3F4F6",
};

const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  subText: "#AAAAAA",
  card: "#1E1E1E",
};
