import { supabase } from "./api/supabase.js";
import { initLogin } from "./pages/login.js";
import { initSignup } from "./pages/signup.js";
import { getAuthState, renderAuthState } from "./api/auth.js";
import { fetchMovies } from "./api/movies.js";
import { initApp } from "./pages/app.js";
import { getActiveCategory, initCategories } from "./pages/categories.js";
import { initProfile } from "./pages/profile.js";
import { initLibrary } from "./pages/library.js";
import { initIndex } from "./pages/index.js";

const user = await getAuthState();

renderAuthState();

const path = window.location.pathname;
const page = path === "/" ? "index" : path.split("/").pop();

const isPage = (name) => page === name || page === `${name}.html`;

if (isPage("login")) {
  initLogin();
} else if (isPage("signup")) {
  initSignup();
} else if (isPage("index")) {
  if (user) window.location.href = "/app";
  else initIndex();
} else if (isPage("app")) {
  initApp();
} else if (isPage("categories")) {
  initCategories();
  const btn = document.querySelector("#categories-start");
  if (btn) btn.addEventListener("click", () => (window.location.href = "/app"));
} else if (isPage("profile")) {
  initProfile();
} else if (isPage("library")) {
  initLibrary();
}
