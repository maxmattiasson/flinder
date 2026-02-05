import { supabase } from "../api/supabase.js";

export function initIndex() {
  document.querySelector("#signup-index").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
  document.querySelector("#cta-main").addEventListener("click", () => {
    window.location.href = "app.html";
  });
}
