import express from "express";
import pool from "../db";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, mode, score } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO scores (user_id, mode, score) VALUES ($1, $2, $3) RETURNING *",
      [user_id, mode, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

export default router;
