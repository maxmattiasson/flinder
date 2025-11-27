import { getAuthState } from "./auth.js";
import { MovieHub } from "../hub/MovieHub.js";
import { supabase } from "./supabase.js";

export async function getYesVotes() {
  const user = await getAuthState();

  if (!user) {
    const data = GuestVotes.load().filter((m) => m.vote === "yes");
    return data;
  }
  const { data, error } = await supabase
    .from("movie_votes")
    .select("movie_id, title, poster_url, created_at, vote")
    .eq("user_id", user.id)
    .eq("vote", "yes");

  console.log(data);

  if (error) {
    console.log(error);
    return [];
  }
  return data;
}
export async function deleteYesVote() {}
