const API_KEY = process.env.EXPO_PUBLIC_OPENTRIPMAP_KEY;
const BASE_URL = "https://api.opentripmap.com/0.1/en/places/radius";

const ALLOWED_KINDS = [
  "cultural",
  "historic",
  "monuments",
  "museums",
  "churches",
  "interesting_places",
  "tourist_facilities",
];

export async function getPlacesNearby({
  lat,
  lon,
  radius = 5000,
  kinds = "",
  limit = 20,
}) {
  // 🛑 safety guard
  if (!lat || !lon) return [];

  // 🧠 филтрираме само позволените категории
  const safeKinds = kinds
    .split(",")
    .map((k) => k.trim())
    .filter((k) => ALLOWED_KINDS.includes(k))
    .join(",");

  // ако няма валидни категории → не викаме API
  if (!safeKinds) {
    console.warn("No valid OpenTripMap kinds, skipping API call");
    return [];
  }

  const url =
    `${BASE_URL}?radius=${radius}` +
    `&lon=${lon}&lat=${lat}` +
    `&kinds=${safeKinds}` +
    `&limit=${limit}` +
    `&apikey=${API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error("OpenTripMap HTTP error", res.status);
    return [];
  }

  const data = await res.json();
  return data.features || [];
}
