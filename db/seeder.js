import { MongoClient } from "mongodb";
import { bunnydata } from "./bunnydata.js";
import { storydata } from "./storydata.js";
import "dotenv/config";

async function importData() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to database");

    const db = client.db(process.env.DB_NAME);

    // Import bunny data
    const bunniesCollection = db.collection("bunnies");
    const bunnyDeleteResult = await bunniesCollection.deleteMany({});
    console.log(`Deleted ${bunnyDeleteResult.deletedCount} bunny documents`);
    const bunnyResult = await bunniesCollection.insertMany(bunnydata);
    console.log(
      `Successfully inserted ${bunnyResult.insertedCount} bunny documents`
    );

    // Import story data
    const storiesCollection = db.collection("stories");
    const storyDeleteResult = await storiesCollection.deleteMany({});
    console.log(`Deleted ${storyDeleteResult.deletedCount} story documents`);
    const storyResult = await storiesCollection.insertMany(storydata);
    console.log(
      `Successfully inserted ${storyResult.insertedCount} story documents`
    );
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Execute importing data
importData().catch(console.error);
