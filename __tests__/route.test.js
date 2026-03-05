import { generateAIItinerary } from "../lib/ai/openaiPlanner";

describe("AI Itinerary Generator", () => {
  test("генерира маршрут за подаден град", async () => {
    const mockInput = {
      city: "Paris",
      days: 3,
      preferences: {
        pace: "normal",
        budget: "medium",
      },
      places: [{ name: "Eiffel Tower" }, { name: "Louvre Museum" }],
    };

    const result = await generateAIItinerary(mockInput);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  test("връща текст съдържащ дни", async () => {
    const mockInput = {
      city: "Rome",
      days: 2,
      preferences: { pace: "slow" },
      places: [{ name: "Colosseum" }],
    };

    const result = await generateAIItinerary(mockInput);

    expect(result.includes("Ден")).toBe(true);
  });
});
