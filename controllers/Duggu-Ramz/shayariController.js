const connectDB = require("../../src/config/Duggu-Ramz/db");
const { ObjectId } = require("mongodb");

async function getShayaris(req, res) {
  const collection = await connectDB();
  const shayaris = await collection.find().toArray();
  res.json(shayaris);
}

async function addShayari(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const collection = await connectDB();
  await collection.insertOne({ text });
  res.json({ message: "Shayari Added" });
}

async function deleteShayari(req, res) {
  const { id } = req.params;
  const collection = await connectDB();
  await collection.deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Shayari Deleted" });
}

async function updateShayari(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    const collection = await connectDB();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { text } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Shayari not found" });
    }
    res.json({ message: "Shayari Updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Shayari" });
  }
}

module.exports = { getShayaris, addShayari, deleteShayari, updateShayari };
