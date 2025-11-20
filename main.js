import { supabase } from "./api/supabase.js";
import { initLogin } from "./pages/login.js";
import { initSignup } from "./pages/signup.js";
import { getAuthState, renderAuthState } from "./api/auth.js";
import { fetchMovies } from "./api/movies.js";
import { initApp } from "./pages/app.js";
import { getActiveCategory, initCategories } from "./pages/categories.js";
import { initProfile } from "./pages/profile.js";

renderAuthState();

const path = window.location.pathname;

if (path.endsWith("login.html")) {
  initLogin();
} else if (path.endsWith("signup.html")) {
  initSignup();
} else if (path.endsWith("index.html")) {
  initIndex();
} else if (path.endsWith("app.html")) {
  initApp();
} else if (path.endsWith("categories.html")) {
  initCategories();
  document.querySelector("#categories-start").addEventListener("click", () => {
    window.location.href = "app.html";
  });
} else if (path.endsWith("profile.html")) {
  initProfile();
}

function initIndex() {
  document.querySelector("#login-index").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  document.querySelector("#signup-index").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}
