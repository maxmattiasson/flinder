import { getAuthState } from "../api/auth.js";
import { getYesVotes } from "../api/votes.js";

export async function initProfile() {
  const user = getAuthState();
  getYesVotes();

  document.querySelector("#reset-storage").addEventListener("click", () => {
    localStorage.clear();
    console.log("reset local storage");
  });
}
