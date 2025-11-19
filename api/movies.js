export async function fetchMovies(page) {
  try {
    const res = await fetch(`http://localhost:4000/api/movies?page=${page}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
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
