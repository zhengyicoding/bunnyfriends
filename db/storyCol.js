import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COL_NAME = "stories";

const storyCol = {
  getStories: async function (query = {}) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COL_NAME);
      return await collection.find(query).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error("Failed to get stories", error);
      throw error;
    } finally {
      await client.close();
    }
  },

  createStory: async function (storyData) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COL_NAME);

      const newStory = {
        userName: storyData.userName,
        title: storyData.title,
        bunnyName: storyData.bunnyName,
        content: storyData.content,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newStory);
      return {
        _id: result.insertedId,
        ...newStory,
      };
    } catch (error) {
      console.error("Failed to create story", error);
      throw error;
    } finally {
      await client.close();
    }
  },

  updateStory: async function (id, updateData) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COL_NAME);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        }
      );
      return result;
    } catch (error) {
      console.error("Failed to update story", error);
      throw error;
    } finally {
      await client.close();
    }
  },

  deleteStory: async function (id) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COL_NAME);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      console.error("Failed to delete story", error);
      throw error;
    } finally {
      await client.close();
    }
  },
};

export default storyCol;
