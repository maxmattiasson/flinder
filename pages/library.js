import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { GuestVotes } from "../utils/localStorage.js";
import { getYesVotes, deleteYesVote } from "../api/votes.js";
import { getFriends } from "../helpers/getFriends.js";
import { getMatchedLibrary } from "../helpers/getMatchedLibrary.js";
import { getFriendsDisplayName } from "../helpers/getFriendsDisplayName.js";
import { getFriendsForUI } from "../helpers/getFriendsCode.js";
import { fetchMovieFull } from "../api/movies.js";

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
  if (container) {
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

  const main = document.getElementById("library-main");
  if (main) {
    main.addEventListener("click", async (e) => {
      const card = e.target.closest(".library-card");
      if (!card) return;

      if (e.target.closest(".delete-library-card")) return;
      if (e.target.closest(".rail-btn")) return;

      const movieID = card.dataset.movieId;
      document.getElementById("movie-modal").classList.add("is-open");
      await renderModal(movieID);
    });
  }
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  document.querySelectorAll(".rail").forEach(setupRail);
  document.querySelectorAll(".match-wrapper").forEach(setupRail);
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

async function renderModal(movieId) {
  const $ = (id) => document.getElementById(id);
  const path = "https://image.tmdb.org/t/p/w500/";
  const DOM = {
    trailer: $("modal-trailer"),
    poster: $("modal-poster"),
    title: $("modal-title"),
    release: $("modal-year"),
    overview: $("modal-desc"),
    genres: $("modal-genres"),
    actors: $("modal-actors"),
    runtime: $("modal-runtime"),
    stream: $("modal-stream"),
    rating: $("modal-rating"),
    tagline: $("modal-tagline"),
    voteCount: $("modal-vote-count"),
    backdrop: $("modal-backdrop"),
    closeBtn: $("close-modal-btn"),
  };
  const movie = await fetchMovieFull(movieId);
  if (!movie) return;
  console.log(movie);
  DOM.title.textContent = movie.release
    ? `${movie.title} (${movie.release.slice(0, 4)})`
    : movie.title;

  DOM.genres.innerHTML = "";

  movie.genres.forEach((el) => {
    const genre = document.createElement("p");
    genre.textContent = el.name;

    DOM.genres.append(genre);
  });

  DOM.rating.textContent = `⭐ ${movie.rating.toFixed(1)}`;
  // DOM.voteCount.textContent = ` /10 (${movie.vote_count} votes)`;
  DOM.voteCount.textContent = ``;

  DOM.runtime.textContent = `🕑 ${Math.floor(movie.runtime / 60)}h ${
    movie.runtime % 60
  }m`;
  DOM.overview.textContent = movie.overview;
  DOM.trailer.src = `${movie.video}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;

  DOM.stream.innerHTML = "";

  const providers = [
    ...(movie.providers?.SE?.flatrate ?? []).map((p) => ({
      ...p,
      region: "SE",
    })),
    ...(movie.providers?.SE?.free ?? []).map((p) => ({ ...p, region: "SE" })),
  ];

  const sorted = [...providers].sort(
    (a, b) => a.display_priority - b.display_priority,
  );

  if (sorted.length === 0) {
    DOM.stream.textContent = "No streaming found 🦜🏴‍☠️";
    return;
  }

  sorted.forEach((p) => {
    const container = document.createElement("div");
    container.className = "provider-container";

    const providerCont = document.createElement("div");
    providerCont.classList.add("logo-cont");

    const provider = document.createElement("p");

    const providerMap = {
      "Amazon Prime Video": "Amazon Prime",
      "Apple TV Amazon Channel": "Apple TV+",
    };

    let name = providerMap[p.provider_name] || p.provider_name;

    provider.textContent = name;

    const logo = document.createElement("img");

    const flag = document.createElement("img");
    flag.id = "modal-flag";
    flag.src = `/assets/images/se.svg`;

    if (p.logo_path) {
      logo.src = path + p.logo_path;
    }

    providerCont.append(logo, provider);
    container.append(flag, providerCont);
    DOM.stream.append(container);
  });

  // GB: {
  //   flatrate: [...(providersData?.results?.GB?.flatrate ?? [])],
  //   free: [...(providersData?.results?.GB?.free ?? [])],
  // },
}

function closeModal() {
  const modal = document.getElementById("movie-modal");
  const trailer = document.getElementById("modal-trailer");

  modal.classList.remove("is-open");
  if (trailer) trailer.src = "";
}
