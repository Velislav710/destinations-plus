import { generateRoute } from './placesService';
import { buildRoute } from './routeAlgorithm';

export async function generateSmartRoute({
  location,
  preferences,
}) {
  const places = await generateRoute({
    location,
    preferences,
  });

  return buildRoute({
    places,
    preferences,
    maxTimeMinutes: preferences.availableTime,
  });
}
