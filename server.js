import express from "express";
import cookieParser from "cookie-parser";
import { connectToDb } from "./module/conn.js";

const PORT = process.env.PORT || 3000;

const app = express();

import bunniesRouter from "./routes/bunnies.js";

app.use("/api/bunnies/", bunniesRouter);

app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

try {
  connectToDb();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection error", error);
  throw error;
}
