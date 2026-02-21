import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/theme";

export default function Feedback() {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendFeedback() {
    if (!message.trim()) {
      Alert.alert("Грешка", "Моля въведете съобщение.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("feedback").insert([
        {
          user_id: user.id,
          message: message,
        },
      ]);

      if (error) throw error;

      Alert.alert("Благодарим!", "Вашето съобщение беше изпратено успешно.");

      setMessage("");
    } catch (err) {
      console.log("FEEDBACK ERROR →", err);
      Alert.alert("Грешка", "Възникна проблем при изпращане.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <AppHeader title="Обратна връзка" />

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ФОРМА */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 18,
            borderRadius: 20,
            marginBottom: 25,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.text,
            }}
          >
            Изпратете ни съобщение
          </Text>

          <TextInput
            placeholder="Вашето мнение, идея или сигнал..."
            placeholderTextColor={theme.subText}
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={setMessage}
            style={{
              backgroundColor: theme.input,
              padding: 15,
              borderRadius: 15,
              color: theme.text,
              height: 120,
              textAlignVertical: "top",
              marginBottom: 15,
            }}
          />

          <Pressable
            style={{
              backgroundColor: "#1E90FF",
              padding: 14,
              borderRadius: 20,
              alignItems: "center",
            }}
            onPress={sendFeedback}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Изпрати</Text>
            )}
          </Pressable>
        </View>

        {/* АВТОРИ */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 18,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 15,
              color: theme.text,
            }}
          >
            Автори на проекта
          </Text>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.text }}>👨‍💻 Иван Иванов</Text>
            <Text style={{ color: theme.subText }}>Разработка и дизайн</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.text }}>👩‍💻 Мария Петрова</Text>
            <Text style={{ color: theme.subText }}>UX и тестване</Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ color: theme.subText }}>
              Национална олимпиада по ИТ
            </Text>
            <Text style={{ color: theme.subText }}>
              Професионална гимназия по икономика
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
