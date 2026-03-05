describe("Places data", () => {
  test("местата имат координати", () => {
    const place = {
      name: "Colosseum",
      geometry: {
        location: {
          lat: 41.8902,
          lng: 12.4922,
        },
      },
    };

    expect(place.geometry.location.lat).toBeDefined();
    expect(place.geometry.location.lng).toBeDefined();
  });
});
