import app from "./app";
import dotenv from "dotenv";

import cron from "node-cron";
import { fetchWikidataPlaces } from "./scripts/fetchWikidataPlaces";
import { fetchWikidataFood } from "./scripts/fetchWikidataFood";

// Schedule: every Monday at 10 AM
cron.schedule("0 10 * * 1", () => {
  console.log("⏳ Weekly Wikidata fetch triggered...");
  fetchWikidataPlaces();
  fetchWikidataFood();
});

// fetchWikidataPlaces(); // test one-time

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
