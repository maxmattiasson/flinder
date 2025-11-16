import { supabase } from "./api/supabase.js";
import { initLogin } from "./pages/login.js";
import { initSignup } from "./pages/signup.js";

const path = window.location.pathname;

if (path.endsWith("login.html")) {
  initLogin();
} else if (path.endsWith("signup.html")) {
  initSignup();
}
