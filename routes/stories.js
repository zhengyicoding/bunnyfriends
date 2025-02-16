import express from "express";
import storyCol from "../db/storyCol.js";

const router = express.Router();

// Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await storyCol.getStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new story
router.post("/", async (req, res) => {
  try {
    // Validate incoming data
    const { userName, title, bunnyName, content } = req.body;

    if (!userName || !title || !bunnyName || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body,
      });
    }

    const story = await storyCol.createStory(req.body);
    res.json(story);
  } catch (error) {
    console.error("Story creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update story
router.post("/:id/update", async (req, res) => {
  try {
    await storyCol.updateStory(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete story
router.post("/:id/delete", async (req, res) => {
  try {
    await storyCol.deleteStory(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
