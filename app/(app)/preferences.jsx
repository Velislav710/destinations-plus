import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text, useColorScheme, View
} from 'react-native';

const INTERESTS = [
  { key: 'history', label: '🏛 История' },
  { key: 'nature', label: '🌳 Природа' },
  { key: 'museum', label: '🖼 Музеи' },
  { key: 'architecture', label: '🏙 Архитектура' },
  { key: 'food', label: '🍽 Храна' },
  { key: 'photo', label: '📸 Фото места' },
];

export default function Preferences() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const [hours, setHours] = useState(5);
  const [interests, setInterests] = useState([]);
  const [pace, setPace] = useState('balanced');
  const [budget, setBudget] = useState('medium');
  const [transport, setTransport] = useState(['walk']);

  const toggleInterest = (key) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const toggleTransport = (key) => {
    setTransport((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    const payload = {
      available_time_minutes: hours * 60,
      interests,
      pace,
      budget,
      transport,
    };

    console.log('PREFERENCES →', payload);

    router.push('/route-result');
  };

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#0B1220' : '#F2F5FA' },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>
          Какво търсиш днес?
        </Text>

        <View style={styles.themeSwitch}>
          <Text style={{ fontSize: 18 }}>☀️</Text>
          <Switch
            value={isDark}
            onValueChange={() =>
              setColorScheme(isDark ? 'light' : 'dark')
            }
          />
          <Text style={{ fontSize: 18 }}>🌙</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: isDark ? '#B8C1D9' : '#555' }]}>
        Настрой маршрута според времето, интересите и темпото си
      </Text>

      {/* TIME */}
      <Section title="⏱ Свободно време" dark={isDark}>
        <Text style={styles.value}>{hours} часа</Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={hours}
          onValueChange={setHours}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#CBD5E1"
        />
      </Section>

      {/* INTERESTS */}
      <Section title="🎯 Интереси" dark={isDark}>
        <View style={styles.chips}>
          {INTERESTS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => toggleInterest(item.key)}
              style={[
                styles.chip,
                interests.includes(item.key) && styles.chipActive,
              ]}
            >
              <Text
                style={{
                  color: interests.includes(item.key)
                    ? '#fff'
                    : isDark
                    ? '#E5E7EB'
                    : '#111',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {/* PACE */}
      <Section title="⚡ Темпо" dark={isDark}>
        <Segmented
          options={[
            { key: 'fast', label: 'Бързо' },
            { key: 'balanced', label: 'Балансирано' },
            { key: 'slow', label: 'Спокойно' },
          ]}
          value={pace}
          onChange={setPace}
        />
      </Section>

      {/* BUDGET */}
      <Section title="💸 Бюджет" dark={isDark}>
        <Segmented
          options={[
            { key: 'low', label: 'Нисък' },
            { key: 'medium', label: 'Среден' },
            { key: 'high', label: 'Висок' },
          ]}
          value={budget}
          onChange={setBudget}
        />
      </Section>

      {/* TRANSPORT */}
      <Section title="🚶 Транспорт" dark={isDark}>
        <View style={styles.chips}>
          {[
            { key: 'walk', label: '🚶 Пеш' },
            { key: 'public', label: '🚇 Градски' },
            { key: 'bike', label: '🚲 Велосипед' },
            { key: 'car', label: '🚗 Кола' },
          ].map((t) => (
            <Pressable
              key={t.key}
              onPress={() => toggleTransport(t.key)}
              style={[
                styles.chip,
                transport.includes(t.key) && styles.chipActive,
              ]}
            >
              <Text
                style={{
                  color: transport.includes(t.key)
                    ? '#fff'
                    : isDark
                    ? '#E5E7EB'
                    : '#111',
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {/* BUTTON */}
      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Генерирай маршрут</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------- COMPONENTS ---------- */

function Section({ title, children, dark }) {
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: dark ? '#121A2F' : '#fff' },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: dark ? '#fff' : '#111' }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => (
        <Pressable
          key={o.key}
          onPress={() => onChange(o.key)}
          style={[
            styles.segment,
            value === o.key && styles.segmentActive,
          ]}
        >
          <Text
            style={{
              color: value === o.key ? '#fff' : '#111',
              fontWeight: '500',
            }}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    marginVertical: 12,
    fontSize: 15,
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  value: {
    fontSize: 16,
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#3B82F6',
  },
  button: {
    marginTop: 28,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
