describe("Itinerary split algorithm", () => {
  function splitByDays(plan) {
    return plan.split(/Ден\s\d+/).slice(1);
  }

  test("разделя програмата по дни", () => {
    const plan = `
    Ден 1
    Посещение на музей

    Ден 2
    Разходка в парк
    `;

    const result = splitByDays(plan);

    expect(result.length).toBe(2);
  });
});
