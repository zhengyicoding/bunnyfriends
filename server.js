import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import bunniesRouter from "./routes/bunnies.js";
import storiesRouter from "./routes/stories.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/templates/:name", (req, res) => {
  const templateName = req.params.name;
  const templatePath = path.join(
    __dirname,
    "frontend",
    "templates",
    templateName
  );
  res.sendFile(templatePath);
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

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

export default app;
