import {
  fetchGenres,
  fetchMovieDetails,
  fetchMovieFull,
} from "../api/movies.js";
import { MovieHub } from "../hub/MovieHub.js";
import { getActiveCategory } from "./categories.js";

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

  const rating = document.createElement("p");
  rating.classList.add("rating-app");
  rating.style.marginLeft = "10px";
  rating.textContent = "⭐ " + movie.vote_average.toFixed(1);

  const ratingHelpSpan = document.createElement("span");
  ratingHelpSpan.textContent = " /10";
  ratingHelpSpan.style.fontSize = "0.6rem";
  ratingHelpSpan.classList.add("hidden", "rating-toggle");
  rating.append(ratingHelpSpan);

  const ratingSpan = document.createElement("span");
  ratingSpan.textContent = ` (${movie.vote_count} votes)`;
  ratingSpan.style.fontSize = "0.6rem";
  ratingSpan.classList.add("hidden", "rating-toggle");
  rating.append(ratingSpan);

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
    document.getElementById("movie-modal").classList.remove("hidden");
    renderModal(card.dataset.id);
  });

  document.querySelector("header").addEventListener("click", (e) => {
    handleCategoryClick(e);
    handleProfileClick(e);
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !document.getElementById("movie-modal").classList.contains("hidden")
    ) {
      closeModal();
    }
  });
}
async function renderModal(movieId) {
  const $ = (id) => document.getElementById(id);
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
  DOM.overview.textContent = movie.overview;
  // DOM.title.textContent = movie.title;
  DOM.trailer.src = `${movie.video}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;
  DOM.stream.textContent = movie.stream;

  DOM.closeBtn.addEventListener("click", closeModal, { once: true });
}

function closeModal() {
  const modal = document.getElementById("movie-modal");
  const trailer = document.getElementById("modal-trailer");

  modal.classList.add("hidden");
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
