import { createError } from "../utils/dom.js";
import { supabase } from "../api/supabase.js";

export function initSignup() {
  const signupForm = document.getElementById("signup-form");
  const closeBtn = document.getElementById("close-signup");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
      document.getElementById("signup-password").value !==
      document.getElementById("signup-repeat").value
    ) {
      signupForm.append(createError("Passwords need to match"));
      return;
    }
    const { data, error } = await supabase.auth.signUp(
      {
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value,
      },
      // Lägg till rederict vid verification om vi vill ha det
      // {
      //   emailRedirectTo: "http://localhost:5500/signed-in.html",
      // }
    );
    if (error) {
      signupForm.append(createError(error.message));
    } else {
      signupForm.append(
        createError("An email has been sent to you for verification", "green"),
      );
      console.log("sign up worked!", data);
    }
  });
  closeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
