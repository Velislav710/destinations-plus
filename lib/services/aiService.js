import { generateAIRoute } from "./aiService";
import { generateRoute } from "./placesService";

export async function generateSmartRoute({ location, preferences }) {
  const places = await generateRoute({
    location,
    preferences,
  });

  if (!places.length) {
    throw new Error("No places found");
  }

  const aiRoute = await generateAIRoute({
    city: "Current city",
    preferences,
    places,
  });

  return {
    days: aiRoute,
    rawPlaces: places,
  };
}
