import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { GuestVotes } from "../utils/localStorage.js";

export async function initLibrary() {
  const user = await getAuthState();
  if (!user) {
    const data = GuestVotes.load().filter((m) => m.vote === "yes");
    console.log(data);
    renderCount(data);
    renderLibrary(data);
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
  console.log(data);
  renderCount(data);
  renderLibrary(data);
}
function renderLibrary(data) {
  const cont = document.querySelector("main");
  const path = "https://image.tmdb.org/t/p/w500/";

  const movieCont = document.createElement("div");
  movieCont.classList.add("library-grid");

  data.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("library-card");

    const title = document.createElement("h4");
    title.textContent = movie.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-library-card");
    deleteBtn.textContent = "X";

    const posterCont = document.createElement("div");
    const poster = document.createElement("img");
    poster.classList.add("library-poster");
    poster.src = path + movie.posterUrl;

    posterCont.append(poster);
    card.append(title, deleteBtn, posterCont);
    movieCont.append(card);
  });
  cont.append(movieCont);
}
function renderCount(data) {
  const cont = document.querySelector("main");
  const title = document.createElement("h3");
  const count = document.createElement("span");

  title.textContent = "Library";
  count.textContent = ` (${data.length})`;

  title.append(count);
  cont.append(title);
}

function sortByDate() {}

function renderSort() {
  const button = document.createElement("button");
}
