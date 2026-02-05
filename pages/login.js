import { createError } from "../utils/dom.js";
import { supabase } from "../api/supabase.js";
import { renderAuthState } from "../api/auth.js";

export function initLogin() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  const loginBtn = loginForm.querySelector("button[type='submit']");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      loginForm.append(createError("Invalid user or password"));
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      return;
    }

    loginForm.append(createError("Login successful!", "green"));
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in…";

    const path = window.location.pathname;
    const isIndex = path === "/" || path.endsWith("/index.html");

    renderAuthState();

    if (isIndex) {
      setTimeout(() => {
        window.location.href = "app.html";
      }, 1200);
    } else {
      window.location.href = "app.html";
    }
  });
}
