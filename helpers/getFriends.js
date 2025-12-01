import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";

export async function getFriends() {
  const user = await getAuthState();
  if (!user) return;

  const { data, error } = await supabase
    .from("user_friends")
    .select("*")
    .eq("owner_id", user.id);
  if (error) {
    console.log("Error with getting friendslist from supabase", error);
    return [];
  }
  const friendIDs = (data ?? []).map((el) => el.friend_id);
  if (!friendIDs.length) return [];
  return friendIDs;
}
