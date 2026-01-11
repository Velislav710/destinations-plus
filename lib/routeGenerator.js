import { supabase } from './supabase';

export async function generateRoute({
  startLocation,
  availableTimeMinutes,
  interests,
  pace,
  budget,
  transport,
}) {
  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('is_active', true)
    .in('category', interests)
    .in('price_level', [budget])
    .overlaps('transport_access', transport);

  if (error) throw error;

  // basic scoring
  const scored = places.map((p) => ({
    ...p,
    score:
      p.rating * 2 -
      p.avg_visit_time_minutes / 60,
  }));

  scored.sort((a, b) => b.score - a.score);

  let timeLeft = availableTimeMinutes;
  const route = [];

  for (const place of scored) {
    if (place.avg_visit_time_minutes <= timeLeft) {
      route.push(place);
      timeLeft -= place.avg_visit_time_minutes;
    }
  }

  return {
    stops: route,
    used_time: availableTimeMinutes - timeLeft,
  };
}
