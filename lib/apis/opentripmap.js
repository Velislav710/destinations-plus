const BASE_URL = 'https://api.opentripmap.com/0.1/en/places';
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
    `&kinds=${kinds}` +
    `&limit=${limit}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('OpenTripMap error');
  }

  const data = await res.json();
  return data.features;
}
