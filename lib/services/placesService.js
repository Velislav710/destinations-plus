import { getPlaceDetails, getPlacesNearby } from "../apis/opentripmap";

/**
 * Генерира списък от реални места от OpenTripMap
 * @param {{
 *  location: { lat: number, lon: number },
 *  preferences: {
 *    categories: string[],
 *    radius?: number
 *  }
 * }}
 */
export async function generateRoute({ location, preferences }) {
  if (!location) {
    throw new Error("Липсва локация");
  }

  const { lat, lon } = location;

  if (typeof lat !== "number" || typeof lon !== "number") {
    throw new Error("Невалидна локация (lat/lon)");
  }

  if (!preferences) {
    throw new Error("Липсват предпочитания");
  }

  const categories =
    Array.isArray(preferences.categories) && preferences.categories.length > 0
      ? preferences.categories
      : ["cultural", "historic", "architecture"];

  const radius =
    typeof preferences.radius === "number" && preferences.radius > 0
      ? preferences.radius
      : 5000;

  console.log("OTM PARAMS →", {
    lat,
    lon,
    radius,
    categories,
  });

  const places = await getPlacesNearby({
    lat,
    lon,
    radius,
    kinds: categories,
    limit: 15,
  });

  if (!Array.isArray(places) || places.length === 0) {
    console.warn("OpenTripMap върна 0 места");
    return [];
  }

  const detailedPlaces = [];

  for (const place of places) {
    const xid = place?.properties?.xid;
    if (!xid) continue;

    try {
      const details = await getPlaceDetails(xid);

      detailedPlaces.push({
        xid,
        name: details.name || "Неизвестно място",
        description:
          details.wikipedia_extracts?.text || details.info?.descr || "",
        kinds: details.kinds || "",
        rate: details.rate ?? null,
        lat: details.point?.lat,
        lon: details.point?.lon,
        image: details.preview?.source || null,
        url: details.otm || null,
      });
    } catch (err) {
      console.warn("Пропуснато място:", xid);
    }
  }

  return detailedPlaces;
}
