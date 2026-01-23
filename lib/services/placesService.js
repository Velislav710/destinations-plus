import { getPlacesNearby } from '../apis/opentripmap';

export async function generateRoute({
  location,
  preferences,
}) {
  const kinds = preferences.categories.join(',');

  const places = await getPlacesNearby({
    lat: location.latitude,
    lon: location.longitude,
    radius: preferences.radius || 5000,
    kinds,
    limit: 30,
  });

  // basic scoring (по-късно ще го правим по-умен)
  return places
    .filter(p => p.properties.name)
    .map(p => ({
      id: p.id,
      name: p.properties.name,
      lat: p.geometry.coordinates[1],
      lon: p.geometry.coordinates[0],
      kinds: p.properties.kinds,
      distance: p.properties.dist,
    }))
    .sort((a, b) => a.distance - b.distance);
}
