const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getNearbyPlaces({
  lat,
  lon,
  radius = 3000,
  type = "tourist_attraction",
}) {
  if (!lat || !lon) {
    throw new Error("Невалидна локация.");
  }

  if (!GOOGLE_API_KEY) {
    throw new Error("Липсва Google API ключ.");
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Google Places error: ${data.status}`);
  }

  return data.results.map((place) => ({
    id: place.place_id,
    name: place.name,
    rating: place.rating || 0,
    totalRatings: place.user_ratings_total || 0,
    types: place.types || [],
    lat: place.geometry?.location?.lat,
    lon: place.geometry?.location?.lng,
    address: place.vicinity || "Няма адрес",
  }));
}
