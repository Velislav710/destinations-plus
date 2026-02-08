const OPENTRIPMAP_API_KEY = process.env.EXPO_PUBLIC_OPENTRIPMAP_KEY;
const BASE_URL = "https://api.opentripmap.com/0.1/en/places";

export async function getPlacesNearby({
  lat,
  lon,
  radius = 5000,
  categories = [],
  limit = 20,
}) {
  if (!lat || !lon) {
    throw new Error("OpenTripMap: липсва lat/lon");
  }

  const kinds =
    Array.isArray(categories) && categories.length > 0
      ? categories.join(",")
      : undefined;

  const params = new URLSearchParams({
    apikey: OPENTRIPMAP_API_KEY,
    lat: String(lat),
    lon: String(lon),
    radius: String(radius), // в МЕТРИ
    limit: String(limit),
    rate: "2",
    format: "json",
  });

  if (kinds) {
    params.append("kinds", kinds);
  }

  const url = `${BASE_URL}/radius?${params.toString()}`;

  console.log("OPENTRIPMAP URL →", url);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenTripMap HTTP ${response.status}: ${text}`);
  }

  const data = await response.json();

  // Филтрираме само качествени места
  return data
    .filter((p) => p.name && p.kinds)
    .map((p) => ({
      id: p.xid,
      name: p.name,
      lat: p.point?.lat,
      lon: p.point?.lon,
      kinds: p.kinds,
      rate: p.rate,
      dist: p.dist,
    }));
}
