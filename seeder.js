import { MongoClient } from "mongodb";
import { bunnydata } from "./db/bunnydata.js";
import "dotenv/config";

async function importData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection("bunnies");
    // Delete all existing documents in the collection
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents`);
    // Insert new documents
    const result = await collection.insertMany(bunnydata);
    console.log(`Successfully inserted ${result.insertedCount} documents`);
  } catch (error) {
    console.error("Error inserting documents:", error);
    process.exit(1); // Exit with error code
  } finally {
    if (client) {
      await client.close();
      console.log("Database connection closed");
    }
  }
}
// Execute importing data
importData();
