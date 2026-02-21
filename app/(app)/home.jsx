import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [region, setRegion] = useState(null);

  async function saveLocation(lat, lon) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("user_locations").insert([
      {
        user_id: user.id,
        latitude: lat,
        longitude: lon,
      },
    ]);
  }

  async function useCurrentLocation() {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Грешка", "Няма достъп до локация");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      await saveLocation(location.coords.latitude, location.coords.longitude);

      router.push("/preferences");
    } catch (err) {
      Alert.alert("Грешка", "Проблем с локацията");
    } finally {
      setLoading(false);
    }
  }

  async function useCityInput() {
    if (!cityInput.trim()) {
      Alert.alert("Грешка", "Въведи град");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${cityInput}&key=${GOOGLE_KEY}`,
      );

      const data = await res.json();

      if (!data.results.length) {
        Alert.alert("Грешка", "Градът не е намерен");
        return;
      }

      const loc = data.results[0].geometry.location;

      setRegion({
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      await saveLocation(loc.lat, loc.lng);

      router.push("/preferences");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Начало" />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {region && (
          <MapView
            style={{
              height: 200,
              borderRadius: 20,
              marginBottom: 20,
            }}
            region={region}
          >
            <Marker coordinate={region} />
          </MapView>
        )}

        <Pressable
          style={{
            backgroundColor: "#1E90FF",
            padding: 16,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={useCurrentLocation}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Използвай текущата локация
            </Text>
          )}
        </Pressable>

        <View
          style={{
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 20,
          }}
        >
          <TextInput
            placeholder="Въведи град"
            placeholderTextColor={theme.subText}
            value={cityInput}
            onChangeText={setCityInput}
            style={{
              backgroundColor: theme.input,
              padding: 14,
              borderRadius: 15,
              color: theme.text,
              marginBottom: 10,
            }}
          />

          <Pressable
            style={{
              backgroundColor: "#1E90FF",
              padding: 14,
              borderRadius: 20,
              alignItems: "center",
            }}
            onPress={useCityInput}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Продължи</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
