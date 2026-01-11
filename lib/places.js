import { supabase } from './supabase';

export async function fetchPlaces({ interests }) {
  let query = supabase.from('places').select('*');

  if (interests?.length) {
    query = query.in('category', interests);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error('Грешка при зареждане на места');
  }

  return data;
}
