import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../lib/theme';

export default function AppHeader({ title }) {
  const { toggleTheme, theme, mode } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      <Pressable
  onPress={toggleTheme}
  style={{
    padding: 8,
    borderRadius: 12,
    backgroundColor: theme.card,
  }}
>
  <Text style={{ fontSize: 18 }}>
    {mode === 'dark' ? '☀️' : '🌙'}
  </Text>
</Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
});
