import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Home() {
  async function logout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Добре дошъл в ДестинацииПлюс</Text>

      <Pressable onPress={logout}>
        <Text style={{ marginTop: 20 }}>Изход</Text>
      </Pressable>
    </View>
  );
}
