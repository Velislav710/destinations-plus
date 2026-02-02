import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTheme } from "../../lib/theme";

export default function Planning() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  function handleStartPlanning() {
    router.push({
      pathname: "/route",
      params: {
        location: params.location,
      },
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.bg,
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" color="#1E90FF" />

      <Text
        style={{
          marginVertical: 24,
          fontSize: 16,
          color: theme.text,
          textAlign: "center",
        }}
      >
        Подготвяме планирането на твоя маршрут…
      </Text>

      <Pressable
        onPress={handleStartPlanning}
        style={{
          backgroundColor: "#1E90FF",
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 24,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Започни планиране
        </Text>
      </Pressable>
    </View>
  );
}
