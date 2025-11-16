import { createError } from "../utils/dom.js";
import { supabase } from "../api/supabase.js";

export function initLogin() {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      loginForm.append(createError("Invalid user or password"));
    } else {
      loginForm.append(createError("Login successful!", "green"));
      renderAuthState();
    }
  });
}
