import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { GuestVotes } from "../utils/localStorage.js";

export async function initLibrary() {
  const user = await getAuthState();
  if (!user) {
    const data = GuestVotes.load().filter((m) => m.vote === "yes");
    console.log(data);
    renderLibrary(data);
    return;
  }
  const { data, error } = await supabase
    .from("movie_votes")
    .select("*")
    .eq("user_id", user.id)
    .eq("vote", "yes")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error with getting user votes", error.message);
  }
  console.log(data);
  renderLibrary(data);
}
function renderLibrary(data) {
  const movieCont = document.createElement("div");

  document.body.append(movieCont);
}
