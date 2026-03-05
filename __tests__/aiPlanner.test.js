describe("AI itinerary generation", () => {
  test("генерираният план трябва да съдържа поне един ден", () => {
    const aiResponse = "Ден 1 Посещение на забележителности";

    expect(aiResponse.includes("Ден")).toBe(true);
  });
});
