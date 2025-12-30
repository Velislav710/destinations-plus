import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.replace('/(app)/home');
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) alert(error.message);
  }

  return (
    <View style={[styles.container, theme === 'dark' && styles.dark]}>
      <Pressable onPress={toggleTheme}>
        <Text style={styles.switch}>Смени тема</Text>
      </Pressable>

      <Text style={styles.title}>Вход</Text>

      <TextInput
        placeholder="Имейл"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Парола"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Вход</Text>
      </Pressable>

      <Pressable style={styles.google} onPress={signInWithGoogle}>
        <Text style={styles.buttonText}>Вход с Google</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/register')}>
        <Text>Нямаш профил? Регистрация</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  dark: { backgroundColor: '#0B1B2B' },
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
    marginTop: 8,
  },
  google: {
    backgroundColor: '#DB4437',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  switch: { textAlign: 'center', marginBottom: 20 },
});
