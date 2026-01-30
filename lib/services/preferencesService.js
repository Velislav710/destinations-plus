import { supabase } from "../supabase";

/**
 * Load user preferences
 */
export async function getPreferences() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("get_user_preferences", {
    uid: user.id,
  });

  if (error) throw error;

  return data;
}

/**
 * Save user preferences
 */
export async function savePreferences(preferences) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ preferences })
    .eq("id", user.id);

  if (error) throw error;

  return true;
}
