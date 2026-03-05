describe("Location coordinates", () => {
  test("валидна географска ширина", () => {
    const lat = 42.6977;

    expect(lat).toBeGreaterThan(-90);
    expect(lat).toBeLessThan(90);
  });

  test("валидна географска дължина", () => {
    const lon = 23.3219;

    expect(lon).toBeGreaterThan(-180);
    expect(lon).toBeLessThan(180);
  });
});
