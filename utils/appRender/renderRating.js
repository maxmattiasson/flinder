export function renderRating(movie) {
  const rating = document.createElement("p");
  rating.classList.add("rating-app");
  rating.style.marginLeft = "10px";
  rating.textContent = "⭐ " + movie.vote_average.toFixed(1);

  const ratingHelpSpan = document.createElement("span");
  ratingHelpSpan.textContent = " /10";
  ratingHelpSpan.classList.add("hidden", "rating-toggle");
  rating.append(ratingHelpSpan);

  const ratingSpan = document.createElement("span");
  ratingSpan.textContent = ` (${movie.vote_count} votes)`;
  ratingSpan.classList.add("hidden", "rating-toggle");
  rating.append(ratingSpan);

  return rating;
}
