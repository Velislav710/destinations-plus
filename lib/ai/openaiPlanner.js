import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY,
});

export async function generateAIItinerary({ city, days, preferences, places }) {
  try {
    const prompt = `
Ти си професионален туристически гид.

Създай ПОДРОБЕН и СТРУКТУРИРАН маршрут за ${city} за ${days} дни.

ВАЖНО:
- Използвай само предоставените места
- Подреди програмата по ДНИ
- Включи часове (сутрин, обед, вечер)
- Добави кратко описание към всяка локация
- Направи текста ЧЕТИМ и красиво структуриран

ПОТРЕБИТЕЛ:
- Бюджет: ${preferences.budget}
- Темпо: ${preferences.pace}
- Категории: ${preferences.categories.join(", ")}

ЛОКАЦИИ:
${places
  .map(
    (p, i) => `
${i + 1}. ${p.name}
Рейтинг: ${p.rating}
Адрес: ${p.vicinity}
Тип: ${p.types?.join(", ")}
`,
  )
  .join("\n")}

ФОРМАТ:

Ден 1
🌅 Сутрин:
- място + описание

🍽 Обед:
- място + описание

🌇 Вечер:
- място + описание

(повтори за всички дни)

Добави емоджита и направи текста приятен за четене.
`;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.log("AI ERROR →", err);
    return "Грешка при генериране на маршрут.";
  }
}
