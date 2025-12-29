import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Създай профил</Text>
      <Text style={styles.subtitle}>
        Регистрирай се в ДестинацииПлюс и получи персонален маршрут
      </Text>

      <TextInput
        placeholder="Име"
        placeholderTextColor="#999"
        style={styles.input}
      />

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

      <TextInput
        placeholder="Повтори паролата"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.registerButton}>
        <Text style={styles.registerText}>Създай профил</Text>
      </Pressable>

      <Pressable style={styles.googleButton}>
        <Text style={styles.googleText}>Регистрация с Google</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/login')}>
        <Text style={styles.loginLink}>
          Вече имаш профил? Влез
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
  registerButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
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
  loginLink: {
    textAlign: 'center',
    marginTop: 24,
    color: '#1E90FF',
    fontSize: 15,
  },
});
