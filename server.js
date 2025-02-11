import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import bunniesRouter from "./routes/bunnies.js";
import storiesRouter from "./routes/stories.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://careerpath.vercel.app"]
        : ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// 1. Essential middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Static file serving
app.use(express.static("frontend"));

// 3. Routes last
app.use("/api/bunnies/", bunniesRouter);
app.use("/api/stories/", storiesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
