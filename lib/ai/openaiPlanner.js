const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;

console.log("OPENAI KEY →", OPENAI_KEY);

export async function generateAIItinerary({ city, days, preferences, places }) {
  if (!OPENAI_KEY) {
    throw new Error("OpenAI ключът е undefined.");
  }

  const placesText = places
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} – ${
          p.vicinity || "Няма адрес"
        } – рейтинг: ${p.rating || "N/A"}`,
    )
    .join("\n");

  const prompt = `
Създай ${days}-дневна туристическа програма за ${city}.
Потребителят има следните предпочитания:
- Бюджет: ${preferences.budget}
- Темпо: ${preferences.pace}
- Категории: ${preferences.categories?.join(", ")}

Използвай САМО тези реални забележителности:

${placesText}

Напиши програмата по дни.
На български език.
Структурирано.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`OpenAI error: ${JSON.stringify(data)}`);
  }

  return data.choices[0].message.content;
}
