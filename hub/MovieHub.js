import { fetchMovies } from "../api/movies.js";
import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";

export class MovieHub {
  static fakeDB = [];

  constructor(category = "popular") {
    this.category = category;
    this.preloadGap = 5;

    this.currentPage = 1;
    this.currentIndex = 0;
    this.movies = [];
    this.position = 0;
  }

  async init() {
    this.movies = await fetchMovies(this.currentPage);
  }
  getCurrentMovie() {
    return this.movies[this.currentIndex];
  }

  async handleSwipe(vote) {
    let movie = this.getCurrentMovie();
    if (!movie) return null;

    await this.saveToDB(movie, vote);

    this.currentIndex++;
    this.position++;

    if (this.movies.length - this.currentIndex <= this.preloadGap) {
      await this.loadNextPage();
    }
    return this.getCurrentMovie();
  }

  async saveToDB(movie, vote) {
    const user = await getAuthState();
    if (!user) {
      MovieHub.fakeDB.push({
        id: movie.id,
        vote: vote,
      });
      return;
    }
    const result = await supabase.from("movie_votes").upsert(
      {
        user_id: user.id,
        movie_id: movie.id,
        vote: vote,
        title: movie.title,
        poster_url: movie.poster_path,
      },
      { onConflict: "user_id,movie_id" }
    );
    if (result.error) {
      console.log("Error with storing to supabase" + result.error.message);
      return;
    }
    console.log("Successfully saved to DB " + vote + " for " + movie.id);
  }

  async loadNextPage() {
    this.currentPage++;
    const next = await fetchMovies(this.currentPage);
    this.movies = this.movies.concat(next);
  }
}
