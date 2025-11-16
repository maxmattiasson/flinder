const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("its working");
});

app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase
    .from("movie_votes")
    .select("*")
    .limit(1);

  res.json({ data, error });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost${port}`);
});
