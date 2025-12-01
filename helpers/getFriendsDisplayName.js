import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { getFriends } from "./getFriends.js";

export async function getFriendsDisplayName() {
  const friendIDs = await getFriends();

  const { data: friendsCode, error: friendError } = await supabase
    .from("user_profiles")
    .select("display_name")
    .in("user_id", friendIDs);
  if (friendError) {
    console.log("error with getting friendsdisplayname", friendError);
  }
  console.log(friendsCode);
  return friendsCode;
}
