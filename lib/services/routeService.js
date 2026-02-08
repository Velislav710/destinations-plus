import { generateAIItinerary } from "../ai/openaiPlanner";
import { generateRoute } from "./placesService";

export async function generateSmartRoute({ location, preferences, city }) {
  if (!preferences) {
    throw new Error("Липсват предпочитания");
  }

  const places = await generateRoute({
    location,
    preferences,
  });

  if (!places.length) {
    throw new Error("Няма намерени места");
  }

  const itinerary = await generateAIItinerary({
    city,
    days: preferences.days,
    preferences,
    places,
  });

  return {
    places,
    itinerary,
  };
}
