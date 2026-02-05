import { supabase } from "../api/supabase.js";

export async function getMatchedLibrary() {
  const { data, error } = await supabase.rpc("get_yes_yes_matches_library");

  if (error) {
    console.error(error);
    return [];
  } else {
    return data ?? [];
  }
}
