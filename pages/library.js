import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { GuestVotes } from "../utils/localStorage.js";
import { getYesVotes, deleteYesVote } from "../api/votes.js";
import { getFriends } from "../helpers/getFriends.js";
import { getFriendsYes } from "../helpers/getFriendsYes.js";
import { getFriendsDisplayName } from "../helpers/getFriendsDisplayName.js";
import { getFriendsForUI } from "../helpers/getFriendsCode.js";

export async function initLibrary() {
  const user = await getAuthState();
  if (!user) {
    const data = GuestVotes.load().filter((m) => m.vote === "yes");
    renderCount(data);
    renderLibrary(data);
    addListeners();
    return;
  }
  const { data, error } = await supabase
    .from("movie_votes")
    .select("*")
    .eq("user_id", user.id)
    .eq("vote", "yes")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("error with getting user votes", error.message);
  }
  renderCount(data);
  renderLibrary(data);
  await getFriendsMatches();
  addListeners();
}
function renderLibrary(data) {
  const cont = document.querySelector("main");
  const path = "https://image.tmdb.org/t/p/w500/";

  const movieCont = document.createElement("div");
  movieCont.classList.add("library-grid");

  data.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("library-card");

    // const title = document.createElement("h4");
    // title.textContent = movie.title;

    card.dataset.movieId = movie.movie_id;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-library-card");
    deleteBtn.textContent = "X";

    const posterCont = document.createElement("div");
    const poster = document.createElement("img");
    poster.classList.add("library-poster");
    poster.src = path + movie.poster_url;

    posterCont.append(poster);
    card.append(deleteBtn, posterCont);
    movieCont.append(card);
  });
  cont.append(movieCont);
}
function renderCount(dataOptional) {
  const cont = document.querySelector("#library-h3");
  cont.innerHTML = "";
  cont.textContent = "Library";
  const count = document.createElement("span");

  if (dataOptional === undefined) {
    const cards = document.querySelectorAll(".library-card");
    count.textContent = ` (${cards.length})`;
  } else {
    count.textContent = ` (${dataOptional.length})`;
  }

  cont.append(count);
}

function sortByDate() {}

function renderSort() {
  const button = document.createElement("button");
}

function addListeners() {
  const container = document.querySelector(".library-grid");
  container.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-library-card")) {
      const card = e.target.closest(".library-card");
      let movieId = card.dataset.movieId;
      deleteYesVote(movieId);
      card.remove();
      renderCount();
    }
  });
}
async function getFriendsMatches() {
  const user = await getAuthState();
  if (!user) return;

  const myYes = await getYesVotes();

  const friends = await getFriends();
  console.log("friends IDs: ", friends);

  const friendsYes = await getFriendsYes(user, friends);
  const displayName = await getFriendsForUI();
  console.log("displaynames: ", displayName);
}
