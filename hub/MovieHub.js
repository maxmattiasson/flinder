import { fetchMovies } from "../api/movies.js";
import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { findCurrIndexHelper } from "../utils/findIndexHelper.js";

const PAGE_SIZE = 20;

export class MovieHub {
  static fakeDB = [];

  constructor(category = "popular") {
    this.preloadGap = 5;
    this.category = category;
    this.currentPage = 1;
    this.currentIndex = 0;
    this.position = 0;
    this.movies = [];
  }

  async init() {
    const user = await getAuthState();

    if (!user) {
      const raw = localStorage.getItem(`${this.category}`);
      if (raw) {
        const localProgress = JSON.parse(raw);
        this.currentIndex = localProgress.currentIndex ?? 0;
        this.currentPage = localProgress.currentPage ?? 1;
        this.position = localProgress.position ?? 0;
      }
      this.movies = await fetchMovies(this.currentPage);
      return;
    }

    const { data, error } = await supabase
      .from("user_hub_progress")
      .select("position")
      .eq("user_id", user.id)
      .eq("category", this.category)
      .maybeSingle();

    if (error) {
      console.log("Error to fetch progress from supabase", error);
      this.currentPage = 1;
      this.currentIndex = 0;
      this.position = 0;
      this.movies = await fetchMovies(this.currentPage);
      return;
    }
    const pos = data?.position ?? 0;
    this.position = pos;

    this.currentPage = findCurrIndexHelper(pos, PAGE_SIZE).currPage;
    this.currentIndex = findCurrIndexHelper(pos, PAGE_SIZE).currentIndex;

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

    await this.savePageProgress();

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
      console.log("Error with storing to supabase", result.error.message);
      return;
    }
    console.log("Successfully saved to DB ", vote, " for ", movie.id);
  }
  async savePageProgress() {
    const user = await getAuthState();
    if (!user) {
      const localPosition = {
        currentPage: this.currentPage,
        currentIndex: this.currentIndex,
        position: this.position,
        category: this.category,
      };
      localStorage.setItem(`${this.category}`, JSON.stringify(localPosition));
      return;
    }
    const { error } = await supabase.from("user_hub_progress").upsert(
      {
        user_id: user.id,
        position: this.position,
        category: this.category,
      },
      { onConflict: "user_id,category" }
    );
    if (error) {
      console.log("Error to update progress to supabase", error);
      return;
    }
    console.log("Successfully saved position for ", user.id);
  }
  async loadNextPage() {
    this.currentPage++;
    const next = await fetchMovies(this.currentPage);
    this.movies = this.movies.concat(next);
  }
}
