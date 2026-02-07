import { supabase } from "../api/supabase.js";
import { getAuthState } from "../api/auth.js";

export async function getDisplayName() {
  const user = await getAuthState();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("display_name, friend_code")
    .eq("user_id", user.id) // or eq("user_id", user.id) depending on schema
    .maybeSingle();
  if (error) {
    console.log("getdisplayanme no worky:", error);
    return user.email;
  }

  return (
    data?.display_name ||
    (data?.friend_code ? `#${data.friend_code}` : null) ||
    user.email.split("@")[0]
  );
}
