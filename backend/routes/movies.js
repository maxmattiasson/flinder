const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}&page=${page}`
    );
    if (!response.ok) {
      throw new Error(`Fetch error : ${response.status}`);
    }
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
