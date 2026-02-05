import { supabase } from "../api/supabase.js";

export async function getMatchOnSwipe(movieId) {
  const { data, error } = await supabase.rpc("get_yes_matches_for_movie", {
    movie_id: movieId,
  });
  if (error) {
    console.error(error);
    return [];
  } else {
    console.log("Matches for movie ID:", movieId, data);
    return data ?? [];
  }
}
