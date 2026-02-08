import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import landingImage from "../assets/images/landing.jpg";

export default function Landing() {
  const router = useRouter();
  return (
    <ImageBackground
      source={landingImage}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar style="light" />

      <View style={styles.overlay}>
        <Text style={styles.logo}>
          Дестинации{"\n"}
          <Text style={styles.logoAccent}>Плюс</Text>
        </Text>

        <Text style={styles.subtitle}>
          Интелигентно планиране на маршрути, време и натовареност —{"\n"}
          съобразено с трафик и твоите интереси.
        </Text>

        <View style={styles.buttons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryText}>Вход</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryText}>Създай профил</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 24, 48, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 46,
  },
  logoAccent: {
    color: "#4DA3FF",
  },
  subtitle: {
    fontSize: 16,
    color: "#DCE7FF",
    textAlign: "center",
    marginVertical: 32,
    maxWidth: 340,
    lineHeight: 22,
  },
  buttons: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
