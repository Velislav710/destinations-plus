import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import { translateAuthError } from '../lib/authErrors';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

export default function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(translateAuthError(error.message));
    } else {
      router.replace('/(app)/home');
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <AppHeader title="Вход" />

      <View style={styles.card}>
        <TextInput
          placeholder="Имейл"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Парола"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Pressable style={styles.primary} onPress={signIn}>
          <Text style={styles.primaryText}>Вход</Text>
        </Pressable>

        <Pressable style={styles.google} onPress={signInWithGoogle}>
          <Text style={styles.primaryText}>Google</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/register')}>
          <Text style={styles.link}>Създай профил</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#132B44',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#2E4A67',
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 16,
  },
  primary: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  google: {
    backgroundColor: '#DB4437',
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#4DA3FF',
    marginTop: 16,
  },
});
