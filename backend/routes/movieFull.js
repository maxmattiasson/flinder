const express = require("express");
const dontenv = require("dotenv");
const router = express.Router();

dontenv.config();

router.get("/:movie_id", async (req, res) => {
  try {
    const movie_id = req.params.movie_id;

    const movieDetails = fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_KEY}`
    );

    const movieProviders = fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/watch/providers?api_key=${process.env.TMDB_KEY}`
    );

    const movieTrailer = fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${process.env.TMDB_KEY}`
    );

    const [details, providers, trailer] = await Promise.all([
      movieDetails,
      movieProviders,
      movieTrailer,
    ]);
    for (const el of [details, providers, trailer]) {
      if (!el.ok) {
        throw new Error(`Fetch error : ${el.status}`);
      }
    }

    const [detailsData, providersData, trailerData] = await Promise.all([
      details.json(),
      providers.json(),
      trailer.json(),
    ]);

    const videos = trailerData?.results ?? [];
    const video = videos.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.name.toLowerCase().includes("trailer"))
    );

    let trailerUrl = null;

    if (video && video.key) {
      trailerUrl = `https://www.youtube.com/embed/${video.key}`;
    }

    const movie = {
      movie_id: detailsData?.id,
      title: detailsData?.title ?? null,
      genres: detailsData?.genres ?? [],
      overview: detailsData?.overview ?? null,
      tagline: detailsData?.tagline ?? null,
      backdrop: detailsData?.backdrop_path ?? null,
      poster: detailsData?.poster_path ?? null,
      release: detailsData?.release_date ?? null,
      runtime: detailsData?.runtime ?? null,
      rating: detailsData?.vote_average ?? null,
      vote_count: detailsData?.vote_count ?? null,
      video: trailerUrl,
      providers: {
        SE: {
          flatrate: [...(providersData?.results?.SE?.flatrate ?? [])],
          free: [...(providersData?.results?.SE?.free ?? [])],
        },
        GB: {
          flatrate: [...(providersData?.results?.GB?.flatrate ?? [])],
          free: [...(providersData?.results?.GB?.free ?? [])],
        },
      },
    };
    res.json({
      movie,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
