const categoryMapper = {
  popular: "movies",
  "top-rated": "topRated",
};

export async function fetchMovies(page, category) {
  const endpoint = categoryMapper[category];
  if (!endpoint) {
    throw new Error(`Unknown category: ${category}`);
  }
  try {
    const res = await fetch(
      `http://localhost:4000/api/${endpoint}?page=${page}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
export async function fetchMovieDetails(movie_id) {
  try {
    const res = await fetch(
      `http://localhost:4000/api/movieDetails/${movie_id}`
    );
    if (!res.ok) throw new Error("Could not fetch movie details", res.status);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Caught error movie details", err);
  }
}
export async function fetchMovieFull(movie_id) {
  try {
    const res = await fetch(`http://localhost:4000/api/movieFull/${movie_id}`);
    if (!res.ok) throw new Error("Could not fetch movie details", res.status);
    const data = await res.json();
    return data.movie;
  } catch (err) {
    console.log("Caught error movie details", err);
  }
}
export async function fetchGenres() {
  try {
    const res = await fetch(`http://localhost:4000/api/genres`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
// export async function fetchTopRatedMovies(page) {
//   const url = `http://localhost:4000/api/topRated?page=${page}`;
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Top rated fetch error:", res.status);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log("Catch error fetch top rated: ", error);
//   }
// }
