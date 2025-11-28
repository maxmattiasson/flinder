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

    res.json({ detailsData, providersData, trailerData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
