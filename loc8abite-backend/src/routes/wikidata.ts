import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/places", (req, res) => {
  const filePath = path.join(__dirname, "../../data/wikidata-places.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No data available" });
  }
  const data = fs.readFileSync(filePath, "utf-8");
  res.json(JSON.parse(data));
});

router.get("/food", (req, res) => {
  const filePath = path.join(__dirname, "../../data/wikidata-food.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "No data available" });
  }
  const data = fs.readFileSync(filePath, "utf-8");
  res.json(JSON.parse(data));
});

export default router;
