import { db, connectToDb } from "./conn.js";
import { readFile } from "fs/promises";

const importBunnies = async () => {
  try {
    await connectToDb();
    const jsonData = await readFile("./module/bunnydata.json", "utf8");
    const bunnies = JSON.parse(jsonData).product;

    const cleanedBunnies = bunnies.map((bunny) => ({
      name: bunny.name,
      price: parseFloat(bunny.price.replace("$", "")),
      image: bunny.image,
      link: bunny.link || null,
    }));

    await db.collection("bunnies").deleteMany({});
    const result = await db.collection("bunnies").insertMany(cleanedBunnies);
    console.log(`Inserted ${result.insertedCount} bunnies`);
  } catch (error) {
    console.error("Error:", error);
  }
};

importBunnies();
