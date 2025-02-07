import express from "express";
import { db } from "../module/conn.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bunnies = await db.collection("bunnies").find({}).toArray();
    res.json(bunnies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bunnies" });
  }
});

export default router;
