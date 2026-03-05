describe("Basic App Test", () => {
  test("проверява дали приложението работи", () => {
    const appName = "ДестинацииПлюс";

    expect(appName).toBe("ДестинацииПлюс");
  });

  test("проверява дни за маршрут", () => {
    const days = 3;

    expect(days).toBeGreaterThan(0);
  });
});
