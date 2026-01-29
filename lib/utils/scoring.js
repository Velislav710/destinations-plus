export function scorePlace(place, preferences) {
  let score = 0;

  // по-близо = по-добре
  score += Math.max(0, 10000 - place.distance) / 100;

  // категория
  preferences.categories.forEach(cat => {
    if (place.kinds.includes(cat)) {
      score += 50;
    }
  });

  return score;
}
