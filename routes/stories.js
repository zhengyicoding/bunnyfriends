import express from "express";
import { db } from "../module/conn.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    console.log("GET entries");
    const collection = db.collection("stories");
    const entries = await collection.find({}).toArray();
    res.json({ entries: entries });
  } catch (error) {
    console.error("GET api/stories error, error");
    res.status(500).json({ error: "Failed to get stories" });
  }
});
