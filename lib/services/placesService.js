import { getPlacesNearby } from "../apis/opentripmap";

export async function generateRoute({ location, preferences }) {
  if (!location) {
    throw new Error("Липсва локация");
  }

  if (!preferences || !preferences.categories?.length) {
    throw new Error("Липсват предпочитания");
  }

  const kinds = preferences.categories.join(",");

  const places = await getPlacesNearby({
    lat: location.latitude,
    lon: location.longitude,
    radius: preferences.radius || 5000,
    kinds,
    limit: 30,
  });

  if (!Array.isArray(places)) {
    throw new Error("OpenTripMap не върна валидни данни");
  }

  return places
    .filter((p) => p.properties?.name)
    .map((p) => ({
      id: p.id,
      name: p.properties.name,
      lat: p.geometry.coordinates[1],
      lon: p.geometry.coordinates[0],
      kinds: p.properties.kinds,
      distance: p.properties.dist,
    }));
}
