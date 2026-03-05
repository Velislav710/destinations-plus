describe("User Preferences", () => {
  test("потребителят има зададени дни за пътуване", () => {
    const preferences = {
      days: 4,
      pace: "fast",
    };

    expect(preferences.days).toBeGreaterThan(0);
  });
});
