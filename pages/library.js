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

  const wrapper = document.createElement("div");
  wrapper.classList.add("rail");

  const railBtnLeft = document.createElement("button");
  railBtnLeft.textContent = "<";
  railBtnLeft.classList.add("rail-btn", "rail-btn-left");

  const railBtnRight = document.createElement("button");
  railBtnRight.textContent = ">";
  railBtnRight.classList.add("rail-btn", "rail-btn-right");

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
  wrapper.append(railBtnLeft, movieCont, railBtnRight);
  cont.append(wrapper);
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
  document.querySelectorAll(".rail").forEach(setupRail);
}

async function renderMatchedLibrary(matches) {
  document.querySelector("#matched-library")?.remove();

  const main = document.querySelector("main");
  const section = document.createElement("section");
  section.id = "matched-library";

  if (matches.length === 0) {
    section.textContent = "No matches with friends yet.";
    main.append(section);
    return;
  }

  const path = "https://image.tmdb.org/t/p/w500/";
  const frag = document.createDocumentFragment();

  matches.forEach((match) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("match-wrapper");

    const railBtnLeft = document.createElement("button");
    railBtnLeft.textContent = "<";
    railBtnLeft.classList.add("rail-btn", "rail-btn-left");

    const railBtnRight = document.createElement("button");
    railBtnRight.textContent = ">";
    railBtnRight.classList.add("rail-btn", "rail-btn-right");

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
    wrapper.append(friendTitle, container, railBtnLeft, railBtnRight);
    frag.append(wrapper);
  });
  section.append(frag);
  main.append(section);
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
// Scroll on desktop
function setupRail(railEl) {
  const track = railEl.querySelector(".library-grid");
  const btnLeft = railEl.querySelector(".rail-btn-left");
  const btnRight = railEl.querySelector(".rail-btn-right");

  const scrollAmount = () => Math.floor(track.clientWidth * 0.85);

  function updateButtons() {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const atLeft = track.scrollLeft <= 0;
    const atRight = track.scrollLeft >= maxScrollLeft - 1;

    btnLeft.style.display = atLeft ? "none" : "";
    btnRight.style.display = atRight ? "none" : "";
  }

  btnLeft.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  btnRight.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);

  updateButtons();
}
