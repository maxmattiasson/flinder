import { supabase } from "./supabase.js";

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

  container.innerHTML = "";

  const userCont = document.createElement("p");

  if (user) {
    console.log(user);
    userCont.textContent = `Logged in as: ${user.email}`;
    const logOutBtn = document.createElement("button");
    logOutBtn.textContent = "Logout";
    logOutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      renderAuthState(containerSelector);
    });
    container.append(userCont, logOutBtn);
  } else {
    userCont.textContent = "Not logged in";
    container.append(userCont);
  }
}
