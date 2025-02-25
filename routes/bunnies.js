import express from "express";
import bunnyCol from "../db/bunnyCol.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bunnies = await bunnyCol.getBunnies({});
    res.status(200).json({ bunnies: bunnies });
  } catch (error) {
    console.error("GET api/bunnies error", error);
    res.status(500).json({ error: "Failed to fetch bunnies" });
  }
});

export default router;
