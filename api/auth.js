import { supabase } from "./supabase.js";
import { getDisplayName } from "../helpers/getDisplayName.js";

export async function getAuthState() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function renderAuthState(containerSelector = "#auth-state") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const user = await getAuthState();
  const displayName = await getDisplayName();

  container.innerHTML = "";

  const userCont = document.createElement("span");

  if (user) {
    // const logOutBtn = document.createElement("button");
    // logOutBtn.textContent = "Logout";
    // logOutBtn.addEventListener("click", async () => {
    //   await supabase.auth.signOut();
    //   await renderAuthState();
    // });

    userCont.textContent = displayName;
    const icon = document.createElement("iconify-icon");
    icon.setAttribute("icon", "ph:user-circle-fill");
    icon.style.fontSize = "32px";

    container.append(userCont, icon, logOutBtn);
  } else {
    userCont.textContent = "Guest";

    const icon = document.createElement("iconify-icon");
    icon.setAttribute("icon", "ph:user-circle");
    icon.style.fontSize = "32px";

    container.append(userCont);
    container.append(icon);
  }
}
