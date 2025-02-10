import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import bunniesRouter from "./routes/bunnies.js";
import storiesRouter from "./routes/stories.js";

const PORT = process.env.PORT || 3000;

const app = express();

// 1. Essential middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Static file serving
app.use(express.static("frontend"));

// 3. Routes last
app.use("/api/bunnies/", bunniesRouter);
app.use("/api/stories/", storiesRouter);

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server connection error", error);
  throw error;
}
