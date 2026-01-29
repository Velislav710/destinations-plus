export function distanceInMinutes(distanceMeters, transport) {
  const speeds = {
    walk: 5,     // km/h
    public: 20,
    car: 40,
  };

  const speed = speeds[transport] || 5;
  const km = distanceMeters / 1000;
  return Math.round((km / speed) * 60);
}
