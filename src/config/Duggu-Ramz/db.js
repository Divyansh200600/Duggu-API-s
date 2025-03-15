const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DUGGU_RAMZ_MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db("shayariDB").collection("shayaris");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

module.exports = connectDB;
