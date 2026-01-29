import { getPlacesNearby } from "../apis/opentripmap";

export async function generateRoute({ location, preferences }) {
  if (!location?.latitude || !location?.longitude) {
    throw new Error("Missing location");
  }

  const categories = Array.isArray(preferences?.categories)
    ? preferences.categories
    : [];

  const kinds = categories.join(",");

  const places = await getPlacesNearby({
    lat: location.latitude,
    lon: location.longitude,
    radius: preferences?.radius || 5000,
    kinds,
    limit: 30,
  });

  // 🔥 GUARANTEE ARRAY
  if (!Array.isArray(places)) {
    console.error("Places is not an array", places);
    return [];
  }

  return places
    .filter(
      (p) =>
        p &&
        p.properties &&
        p.properties.name &&
        p.geometry &&
        Array.isArray(p.geometry.coordinates),
    )
    .map((p) => ({
      id: p.id,
      name: p.properties.name,
      lat: p.geometry.coordinates[1],
      lon: p.geometry.coordinates[0],
      kinds: p.properties.kinds,
      distance: p.properties.dist ?? 0,
    }))
    .sort((a, b) => a.distance - b.distance);
}
