import { supabase } from "./api/supabase.js";
import { initLogin } from "./pages/login.js";
import { initSignup } from "./pages/signup.js";
import { getAuthState, renderAuthState } from "./api/auth.js";

renderAuthState();

const path = window.location.pathname;

if (path.endsWith("login.html")) {
  initLogin();
} else if (path.endsWith("signup.html")) {
  initSignup();
} else if (path.endsWith("index.html")) {
  initIndex();
}
function initIndex() {
  document.querySelector("#login-index").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  document.querySelector("#signup-index").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}
