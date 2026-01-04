import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import { useTheme } from '../../lib/theme';

const INTERESTS = [
  { key: 'history', label: '🏛 История' },
  { key: 'nature', label: '🌳 Природа' },
  { key: 'museum', label: '🖼 Музеи' },
  { key: 'architecture', label: '🏙 Архитектура' },
  { key: 'food', label: '🍽 Храна' },
  { key: 'photo', label: '📸 Фото места' },
];

export default function Preferences() {
  const { theme } = useTheme();

  const [hours, setHours] = useState(5);
  const [interests, setInterests] = useState([]);
  const [pace, setPace] = useState('balanced');
  const [budget, setBudget] = useState('medium');
  const [transport, setTransport] = useState(['walk']);

  const toggleInterest = (key) => {
    setInterests((prev) =>
      prev.includes(key)
        ? prev.filter((i) => i !== key)
        : [...prev, key]
    );
  };

  const toggleTransport = (key) => {
    setTransport((prev) =>
      prev.includes(key)
        ? prev.filter((t) => t !== key)
        : [...prev, key]
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Предпочитания" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Настрой маршрута според времето, интересите и темпото си
        </Text>

        {/* TIME */}
        <Section title="⏱ Свободно време" theme={theme}>
          <Text style={[styles.value, { color: theme.text }]}>
            {hours} часа
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={hours}
            onValueChange={setHours}
            minimumTrackTintColor="#1E90FF"
            maximumTrackTintColor="#CBD5E1"
          />
        </Section>

        {/* INTERESTS */}
        <Section title="🎯 Интереси" theme={theme}>
          <View style={styles.chips}>
            {INTERESTS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => toggleInterest(item.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: interests.includes(item.key)
                      ? '#1E90FF'
                      : 'transparent',
                    borderColor: interests.includes(item.key)
                      ? '#1E90FF'
                      : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: interests.includes(item.key)
                      ? '#fff'
                      : theme.text,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* PACE */}
        <Section title="⚡ Темпо" theme={theme}>
          <Segmented
            options={[
              { key: 'fast', label: 'Бързо' },
              { key: 'balanced', label: 'Балансирано' },
              { key: 'slow', label: 'Спокойно' },
            ]}
            value={pace}
            onChange={setPace}
            theme={theme}
          />
        </Section>

        {/* BUDGET */}
        <Section title="💸 Бюджет" theme={theme}>
          <Segmented
            options={[
              { key: 'low', label: 'Нисък' },
              { key: 'medium', label: 'Среден' },
              { key: 'high', label: 'Висок' },
            ]}
            value={budget}
            onChange={setBudget}
            theme={theme}
          />
        </Section>

        {/* TRANSPORT */}
        <Section title="🚶 Транспорт" theme={theme}>
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
                  {
                    backgroundColor: transport.includes(t.key)
                      ? '#1E90FF'
                      : 'transparent',
                    borderColor: transport.includes(t.key)
                      ? '#1E90FF'
                      : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: transport.includes(t.key)
                      ? '#fff'
                      : theme.text,
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
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

function Section({ title, children, theme }) {
  return (
    <View style={[styles.section, { backgroundColor: theme.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Segmented({ options, value, onChange, theme }) {
  return (
    <View
      style={[
        styles.segmented,
        { backgroundColor: theme.border },
      ]}
    >
      {options.map((o) => (
        <Pressable
          key={o.key}
          onPress={() => onChange(o.key)}
          style={[
            styles.segment,
            value === o.key && { backgroundColor: '#1E90FF' },
          ]}
        >
          <Text
            style={{
              color: value === o.key ? '#fff' : theme.text,
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
  subtitle: {
    marginVertical: 12,
    fontSize: 15,
  },
  section: {
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#1E90FF',
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
