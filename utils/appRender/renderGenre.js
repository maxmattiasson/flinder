export function renderGenre(movie) {
  const genres = movie.genres.forEach((g) => {
    const p = document.createElement("p");
    p.textContent = g.name;
  });
  return genres;
}
