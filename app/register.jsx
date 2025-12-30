import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'exp://localhost:19000',
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Провери имейла си за потвърждение');
      router.replace('/login');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        placeholder="Имейл"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Парола (мин. 6 символа)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={signUp}>
        <Text style={styles.buttonText}>Създай профил</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
});
