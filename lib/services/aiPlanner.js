export function buildRoutePrompt({ city, preferences, places }) {
  return `
You are a professional travel planner.

Create a ${preferences.days}-day travel itinerary.

Rules:
- Pace: ${preferences.pace}
- Budget: ${preferences.budget}
- Radius: ${preferences.radius} meters
- Transport: ${preferences.transport.join(", ")}
- Categories: ${preferences.categories.join(", ")}

Available places:
${places
  .map((p) => `- ${p.name} (${p.kinds}) distance ${Math.round(p.distance)}m`)
  .join("\n")}

Output STRICT JSON ONLY:

[
  {
    "day": 1,
    "theme": "short title",
    "stops": [
      {
        "name": "",
        "reason": "",
        "estimated_minutes": 60
      }
    ]
  }
]
`;
}
