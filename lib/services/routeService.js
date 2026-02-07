import { generateRoute } from "./placesService";

export async function generateSmartRoute({ location, preferences }) {
  const places = await generateRoute({ location, preferences });

  const days = preferences.days || 1;
  const perDay = Math.ceil(places.length / days);

  const program = [];

  for (let i = 0; i < days; i++) {
    const dayPlaces = places.slice(i * perDay, (i + 1) * perDay);

    program.push({
      day: i + 1,
      description:
        dayPlaces.length === 0
          ? "Свободен ден за почивка."
          : `Посети: ${dayPlaces.map((p) => p.name).join(", ")}`,
      places: dayPlaces,
    });
  }

  return {
    days: program,
  };
}
