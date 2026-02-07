const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function generateAIItinerary({ preferences, places }) {
  if (!OPENAI_API_KEY) {
    throw new Error("Липсва OpenAI API ключ");
  }

  const placesText = places
    .slice(0, 15)
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} – категории: ${p.kinds}, разстояние: ${Math.round(
          p.distance,
        )}м`,
    )
    .join("\n");

  const prompt = `
Ти си туристически AI асистент.
Създай подробна туристическа програма НА БЪЛГАРСКИ.

Предпочитания:
- Категории: ${preferences.categories.join(", ")}
- Брой дни: ${preferences.days}
- Бюджет: ${preferences.budget || "няма ограничение"}
- Темпо: ${preferences.tempo || "нормално"}

Налични места:
${placesText}

Направи програма по дни:
Ден 1, Ден 2 и т.н.
Добави съвети и логичен ред.
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const json = await res.json();

  if (!json.choices?.length) {
    throw new Error("AI не върна резултат");
  }

  return json.choices[0].message.content;
}
