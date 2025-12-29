import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Вход</Text>
      <Text style={styles.subtitle}>
        Влез в ДестинацииПлюс и планирай интелигентно своето пътуване
      </Text>

      <TextInput
        placeholder="Имейл"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Парола"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.loginButton}>
        <Text style={styles.loginText}>Вход</Text>
      </Pressable>

      <Pressable style={styles.googleButton}>
        <Text style={styles.googleText}>Вход с Google</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/register')}>
        <Text style={styles.registerLink}>
          Нямаш профил? Създай нов
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0A2540',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A5D73',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E1E6EF',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D7E2',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 12,
  },
  googleText: {
    fontSize: 16,
    color: '#0A2540',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 24,
    color: '#1E90FF',
    fontSize: 15,
  },
});
