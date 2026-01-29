import { distanceInMinutes } from '../utils/geo';
import { scorePlace } from '../utils/scoring';

export function buildRoute({
  places,
  preferences,
  maxTimeMinutes,
}) {
  let remainingTime = maxTimeMinutes;
  const route = [];

  const enriched = places.map(p => ({
    ...p,
    visitTime: preferences.avgVisitTime || 60,
    score: scorePlace(p, preferences),
  }));

  enriched
    .sort((a, b) => b.score - a.score)
    .forEach(place => {
      const travelTime = distanceInMinutes(
        place.distance,
        preferences.transport
      );

      const totalTime = travelTime + place.visitTime;

      if (remainingTime - totalTime >= 0) {
        remainingTime -= totalTime;
        route.push(place);
      }
    });

  return {
    route,
    usedTime: maxTimeMinutes - remainingTime,
    remainingTime,
  };
}
