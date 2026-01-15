import { supabase } from "../api/supabase.js";

export function initIndex() {
  document.querySelector("#login-index").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  document.querySelector("#signup-index").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}
