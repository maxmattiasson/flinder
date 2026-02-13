import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { GuestVotes } from "../utils/localStorage.js";
import { getYesVotes, deleteYesVote } from "../api/votes.js";
import { getFriends } from "../helpers/getFriends.js";
import { getMatchedLibrary } from "../helpers/getMatchedLibrary.js";
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
  const friendData = await getMatchedLibrary();
  console.log("Frienddata:", friendData);
  renderCount(data);
  renderLibrary(data);
  const matches = groupMatchesByPartner(friendData);
  console.log(matches);
  renderMatchedLibrary(matches);
  addListeners();
}
function renderLibrary(data) {
  const cont = document.querySelector("main");
  const path = "https://image.tmdb.org/t/p/w500/";

  const movieCont = document.createElement("div");
  movieCont.classList.add("library-grid");
  movieCont.id = "my-library-grid";

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
    const cards = document.querySelectorAll("#my-library-grid .library-card");
    count.textContent = ` (${cards.length})`;
  } else {
    count.textContent = ` (${dataOptional.length})`;
  }

  cont.append(count);
}

function addListeners() {
  const container = document.querySelector("#my-library-grid");
  if (!container) return;

  container.addEventListener("click", async (e) => {
    if (!e.target.matches(".delete-library-card")) return;

    const card = e.target.closest(".library-card");
    if (!card) return;

    let movieId = card.dataset.movieId;
    await deleteYesVote(movieId);

    card.remove();
    renderCount();
  });
}
async function renderMatchedLibrary(matches) {
  if (matches.length === 0) {
    const bigwrappa = document.createElement("div");
    bigwrappa.textContent = "No matches with friends yet.";
    document.querySelector("main").append(bigwrappa);
    return;
  }

  const path = "https://image.tmdb.org/t/p/w500/";

  matches.forEach((match) => {
    const wrapper = document.createElement("div");

    const container = document.createElement("div");
    container.classList.add("library-grid");

    const friendTitle = document.createElement("h4");
    friendTitle.textContent = `Matches with ${match.partner_display_name} (${match.movies.length})`;

    for (const movie of match.movies) {
      const card = document.createElement("div");
      card.classList.add("library-card");
      card.dataset.movieId = movie.movie_id;

      const posterCont = document.createElement("div");
      const poster = document.createElement("img");
      poster.classList.add("library-poster");
      poster.src = path + movie.poster_url;

      posterCont.append(poster);
      card.append(posterCont);
      container.append(card);
    }
    wrapper.append(friendTitle, container);
    document.querySelector("main").append(wrapper);
  });
}

function groupMatchesByPartner(matches) {
  const groups = new Map();

  for (const m of matches) {
    let g = groups.get(m.partner_id);
    if (!g) {
      g = {
        partner_id: m.partner_id,
        partner_display_name:
          m.partner_display_name || `#${m.partner_friend_code}`,
        partner_friend_code: m.partner_friend_code,
        movies: [],
      };
      groups.set(m.partner_id, g);
    }
    g.movies.push(m);
  }

  return Array.from(groups.values());
}
