import { supabase } from "./supabase";

export async function renderAuthState() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    loggedInAs.textContent = `Logged in as: ${user.email}`;
    logOutBtn.style.display = "block";
  } else {
    loggedInAs.textContent = "Not logged in";
    logOutBtn.style.display = "none";
  }
}
