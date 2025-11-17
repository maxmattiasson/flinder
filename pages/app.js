import { fetchMovies, fetchGenres } from "../api/movies.js";

let genreList = [];
let currentPage = 1;
let movies = [];
let currentMovieIndex = 0;
let fakeDB = [];
let preloadGap = 5;

export async function initApp() {
  movies = await fetchMovies(currentPage);
  genreList = await fetchGenres();
  console.log(movies);
  renderMovie();
}

function renderMovie() {
  const path = "https://image.tmdb.org/t/p/w500/";
  const cont = document.querySelector("#movie-cont");
  cont.innerHTML = "";
  const movie = movies[currentMovieIndex];

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

  const bgUrl = path + movie.backdrop_path;
  document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${bgUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

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

  yesBtn.addEventListener("click", handleYes);
  //   noBtn.addEventListener("click", handleNo);

  posterCont.append(yesBtn);
  posterCont.prepend(noBtn);
}

function handleYes() {
  saveToDB();
  renderNextMovie();
  if (movies.length - currentMovieIndex <= preloadGap) {
    loadNextPage();
  }
}

function saveToDB() {
  fakeDB.push(movies[currentMovieIndex]);
}

async function loadNextPage() {
  currentPage++;
  const next = await fetchMovies(currentPage);
  movies = movies.concat(next);
}
function renderNextMovie() {
  currentMovieIndex++;
  renderMovie();
}
function clear() {
  genreList = [];
  currentPage = 1;
  movies = [];
  currentMovieIndex = 0;
  fakeDB = [];
}
