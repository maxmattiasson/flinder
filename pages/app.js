import { fetchMovies, currentPage } from "../api/movies.js";

export async function initApp() {
  const container = document.querySelector("#movie-cont");
  const data = await fetchMovies();
  console.log(data);
}
