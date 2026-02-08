const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;

export async function generateAIItinerary({ city, days, preferences, places }) {
  const placesText = places
    .map(
      (p, i) =>
        `${i + 1}. ${p.name}\nОписание: ${p.description}\nКатегории: ${p.kinds}`,
    )
    .join("\n\n");

  const prompt = `
Град: ${city}
Брой дни: ${days}
Предпочитания: ${preferences.categories.join(", ")}

Забележителности:
${placesText}

Направи подробна туристическа програма по дни на БЪЛГАРСКИ.
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ти си туристически AI." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenAI error: " + err);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
