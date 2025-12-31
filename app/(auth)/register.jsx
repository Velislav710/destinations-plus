import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { translateAuthError } from '../../lib/authErrors';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/theme';

export default function Register() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    if (password.length < 8) {
      alert('Паролата трябва да е поне 8 символа');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'destinationsplus://login',
      },
    });

    if (error) {
      alert(translateAuthError(error.message));
    } else {
      alert('Провери имейла си за потвърждение 📧');
      router.replace('/login');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <AppHeader title="Регистрация" />

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Имейл"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { color: theme.text }]}
        />

        <TextInput
          placeholder="Парола (мин. 8 символа)"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { color: theme.text }]}
        />

        <Pressable style={styles.primary} onPress={signUp}>
          <Text style={styles.primaryText}>Създай профил</Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Вече имаш профил? Вход</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 20,
    padding: 22,
    borderRadius: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#2E4A67',
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 16,
  },
  primary: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  primaryText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 18,
    textAlign: 'center',
    color: '#4DA3FF',
    fontSize: 15,
  },
});
