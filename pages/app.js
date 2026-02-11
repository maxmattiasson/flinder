import {
  fetchGenres,
  fetchMovieDetails,
  fetchMovieFull,
} from "../api/movies.js";
import { MovieHub } from "../hub/MovieHub.js";
import { getActiveCategory } from "./categories.js";
import { renderRating } from "../utils/appRender/renderRating.js";
import { renderGenre } from "../utils/appRender/renderGenre.js";

let hub;
let genreList = [];

export async function initApp() {
  genreList = await fetchGenres();
  const category = getActiveCategory();

  hub = new MovieHub(category);

  await hub.init();

  renderMovie();
  renderCategory(category);
  loadListeners();
}

function renderMovie() {
  const path = "https://image.tmdb.org/t/p/w500/";
  const cont = document.querySelector("#movie-cont");
  cont.innerHTML = "";

  const movie = hub.getCurrentMovie();
  if (!movie) return;

  console.log(movie);
  const genreCont = document.createElement("div");
  genreCont.classList.add("genre-cont");

  movie.genre_ids.forEach((el) => {
    const genre = document.createElement("p");
    genre.textContent = genreList.find((c) => c.id === el).name;

    genreCont.append(genre);
  });

  const release = document.createElement("p");
  release.classList.add("release-year-app");
  release.textContent = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "—";

  const posterCont = document.createElement("div");
  posterCont.classList.add("poster-cont");
  posterCont.dataset.id = movie.id;

  const poster = document.createElement("img");
  poster.src = path + movie.poster_path;
  poster.classList.add("swipe-poster");

  renderBackdrop(movie, path);

  const rating = renderRating(movie);

  // const desc = document.createElement("p");
  // desc.classList.add("desc-cont");
  // desc.textContent = movie.overview;

  posterCont.append(poster);
  cont.append(release, posterCont, genreCont, rating);
  renderButtons();
}
function renderButtons() {
  const yesBtn = document.createElement("button");
  const noBtn = document.createElement("button");
  const posterCont = document.querySelector("#movie-cont");
  yesBtn.classList.add("yes-btn");
  noBtn.classList.add("no-btn");

  yesBtn.textContent = "❤️‍🔥";
  noBtn.textContent = "❌";

  yesBtn.classList.add("no-modal");
  noBtn.classList.add("no-modal");

  yesBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await hub.handleSwipe("yes");
    renderMovie();
  });
  noBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await hub.handleSwipe("no");
    renderMovie();
  });

  posterCont.append(noBtn);
  posterCont.append(yesBtn);
}
function renderCategory(category) {
  const container = document.createElement("div");
  container.classList.add("container-category");

  const currCat = document.createElement("h2");

  const span = document.createElement("span");
  span.classList.add("category-span");
  span.textContent = "Currently on:";

  currCat.textContent =
    category.slice(0, 1).toUpperCase() + category.slice(1).toLowerCase();
  currCat.classList.add("category-app");

  container.append(currCat, span);
  document.querySelector("header").prepend(container);
}

function renderBackdrop(movie, path) {
  const bgUrl = path + movie.backdrop_path;
  document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}
function loadListeners() {
  const container = document.querySelector("#movie-cont");
  if (!container) return;

  container.addEventListener("click", (e) => {
    if (e.target.closest(".no-modal")) return;
    handleRatingClick(e);
    const card = e.target.closest(".poster-cont");
    if (!card || !container.contains(card)) return;

    console.log("click");
    document.getElementById("movie-modal").classList.add("is-open");
    document.querySelector(".yes-btn").style.display = "none";
    document.querySelector(".no-btn").style.display = "none";
    renderModal(card.dataset.id);
  });

  document.querySelector("header").addEventListener("click", (e) => {
    handleCategoryClick(e);
    handleProfileClick(e);
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      document.getElementById("movie-modal").classList.contains("is-open")
    ) {
      closeModal();
    }
  });
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeModal);

  document.getElementById("modal-yes").addEventListener("click", async () => {
    await hub.handleSwipe("yes");
    renderMovie();
    closeModal();
  });
  document.getElementById("modal-no").addEventListener("click", async () => {
    await hub.handleSwipe("no");
    renderMovie();
    closeModal();
  });
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
    provider.textContent = p.provider_name;
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

  document.querySelector(".no-btn").style.display = "";
  document.querySelector(".yes-btn").style.display = "";

  modal.classList.remove("is-open");
  if (trailer) trailer.src = "";
}
function handleRatingClick(e) {
  const rating = e.target.closest(".rating-app");
  if (!rating) return;

  document.querySelectorAll(".rating-toggle").forEach((el) => {
    el.classList.toggle("hidden");
  });
}

function handleCategoryClick(e) {
  const category = e.target.closest(".category-app");
  if (!category) return;

  window.location.href = "categories.html";
}
function handleProfileClick(e) {
  const profile = e.target.closest("#auth-state");
  if (!profile) return;
  window.location.href = "profile.html";
}

function handleStreamProviders() {}
