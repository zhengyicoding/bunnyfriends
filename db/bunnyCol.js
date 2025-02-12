import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

function BunnyCol() {
  const COL_NAME = "bunnies";
  const self = {};

  self.getBunnies = async (query = {}) => {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COL_NAME);

      const result = await collection
        .find(query)
        .collation({ locale: "en" }) // Add collation for proper string comparison
        .sort({ name: 1 })
        .toArray();

      return result;
    } catch (error) {
      console.error("Failed to get bunnies", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  return self;
}

const bunnyCol = BunnyCol();
export default bunnyCol;
