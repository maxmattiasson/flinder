import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { getYesVotes } from "../api/votes.js";

export async function initProfile() {
  const user = getAuthState();
  getYesVotes();

  document.querySelector("#reset-storage").addEventListener("click", () => {
    localStorage.clear();
    console.log("reset local storage");
  });
}

function generateFriendCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomNum = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomNum);
  }
  return code;
}
async function getOrMakeCode() {
  const user = await getAuthState();
  if (!user) return; // Maybe return SIGNUPNOW hehe

  const { profile: data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  if (profile) {
    return profile.friend_code;
  }

  let friendCode = generateFriendCode();

  const { postData, postError } = await supabase
    .from("user_profiles")
    .insert("friend_code", friendCode);
  if (postError) {
    console.log("error posting friend code", postError);
  }
}
async function checkFriendCode() {}
