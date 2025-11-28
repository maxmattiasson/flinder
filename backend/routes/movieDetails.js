const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();

router.get("/:movie_id", async (req, res) => {
  try {
    const movie_id = req.params.movie_id;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Fetch error : ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log("Caught error movie details", err);
  }
});

module.exports = router;
