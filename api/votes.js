import { getAuthState } from "./auth.js";
import { MovieHub } from "../hub/MovieHub.js";
import { supabase } from "./supabase.js";

export async function getYesVotes() {
  const user = await getAuthState();

  if (!user) {
    console.log("User not found");
    console.log(MovieHub.fakeDB);
    return;
  }
  const { data, error } = await supabase
    .from("movie_votes")
    .select("vote")
    .eq("user_id", user.id)
    .eq("vote", "yes");

  console.log(data);

  if (error) console.log(error);
}
