const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}page=${page}`
    );
    if (!response.ok)
      throw new Error("Failed to fetch top rated: ", response.status);
    const data = response.json();
    res.json(data.results);
  } catch (error) {
    console.log("Caught error fetch top rated: ", error);
  }
});

module.exports = router;
