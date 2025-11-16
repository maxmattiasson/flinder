export let currentPage = 1;

export async function fetchMovies() {
  try {
    const res = await fetch(
      `http://localhost:4000/api/movies?page=${currentPage}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
// export function loadNextPage() {}
