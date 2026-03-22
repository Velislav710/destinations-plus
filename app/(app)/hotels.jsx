import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export default function Hotels({ location }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lon}&radius=3000&type=lodging&key=${GOOGLE_KEY}`,
      );

      const data = await res.json();
      setHotels(data.results.slice(0, 10));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView style={styles.container}>
      {hotels.map((hotel, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.title}>{hotel.name}</Text>
          <Text>⭐ {hotel.rating || "N/A"}</Text>
          <Text>{hotel.vicinity}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});
