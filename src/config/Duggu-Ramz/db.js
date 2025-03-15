const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = "mongodb+srv://divyansh20060:Divyansh%4012@cluster0.8kvfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    return client.db("shayariDB").collection("shayaris");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

module.exports = connectDB;
