import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation } from '../../lib/location';

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLocation() {
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Определяне на локация…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
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

      {/* Горен бар */}
      <View style={styles.header}>
        <Text style={styles.title}>ДестинацииПлюс</Text>
      </View>

      {/* Floating бутон */}
      <Pressable
        style={styles.planButton}
        onPress={() => router.push('/preferences')}
      >
        <Text style={styles.planText}>Планирай маршрут</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  planButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#1E90FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    elevation: 4,
  },
  planText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
