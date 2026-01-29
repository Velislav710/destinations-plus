const BASE_URL = "https://api.opentripmap.com/0.1/en/places";
const API_KEY = process.env.EXPO_PUBLIC_OPENTRIPMAP_KEY;

export async function getPlacesNearby({
  lat,
  lon,
  radius = 5000,
  kinds,
  limit = 20,
}) {
  const url =
    `${BASE_URL}/radius?` +
    `apikey=${API_KEY}` +
    `&lat=${lat}` +
    `&lon=${lon}` +
    `&radius=${radius}` +
    `&limit=${limit}` +
    (kinds ? `&kinds=${kinds}` : "");

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("OpenTripMap HTTP error", res.status);
      return [];
    }

    const data = await res.json();

    // 🔥 КЛЮЧОВО
    if (!data || !Array.isArray(data.features)) {
      console.warn("OpenTripMap returned no features", data);
      return [];
    }

    return data.features;
  } catch (err) {
    console.error("OpenTripMap fetch failed", err);
    return [];
  }
}
