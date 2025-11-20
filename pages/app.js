import { fetchGenres } from "../api/movies.js";
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
}

function renderMovie() {
  const path = "https://image.tmdb.org/t/p/w500/";
  const cont = document.querySelector("#movie-cont");
  cont.innerHTML = "";

  const movie = hub.getCurrentMovie();
  if (!movie) return;

  const genreCont = document.createElement("div");
  genreCont.classList.add("genre-cont");

  movie.genre_ids.forEach((el) => {
    const genre = document.createElement("p");
    genre.textContent = genreList.find((c) => c.id === el).name;

    genreCont.append(genre);
  });

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const release = document.createElement("p");
  release.textContent = movie.release_date.slice(0, 4);

  const posterCont = document.createElement("div");
  posterCont.classList.add("poster-cont");
  const poster = document.createElement("img");
  poster.src = path + movie.poster_path;
  poster.classList.add("swipe-poster");

  renderBackdrop(movie, path);

  const rating = document.createElement("p");
  rating.textContent = "⭐ " + movie.vote_average.toFixed(1);

  const desc = document.createElement("p");
  desc.textContent = movie.overview;

  posterCont.append(poster);
  cont.append(title, release, posterCont, desc, genreCont, rating);
  renderButtons();
}
function renderButtons() {
  const yesBtn = document.createElement("button");
  const noBtn = document.createElement("button");
  const posterCont = document.querySelector(".poster-cont");

  yesBtn.textContent = "👍";
  noBtn.textContent = "👎";

  yesBtn.addEventListener("click", async () => {
    await hub.handleSwipe("yes");
    renderMovie();
  });
  noBtn.addEventListener("click", async () => {
    await hub.handleSwipe("no");
    renderMovie();
  });

  posterCont.append(yesBtn);
  posterCont.prepend(noBtn);
}
function renderCategory(category) {
  const currCat = document.createElement("h2");
  currCat.textContent = category;
  document.querySelector("#movie-cont").prepend(currCat);
}
function renderBackdrop(movie, path) {
  const bgUrl = path + movie.backdrop_path;
  document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}
