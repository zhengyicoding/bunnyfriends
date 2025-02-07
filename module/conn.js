import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017";
const dbName = "bunnydb";

let db;

async function connectToDb() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to the database");
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("MongoDB connection error", error);
    throw error;
  }
}

export { connectToDb, db };
