const express = require("express");
const { getShayaris, addShayari, deleteShayari, updateShayari } = require("../../controllers/Duggu-Ramz/shayariController");

const router = express.Router();

router.get("/get", getShayaris);      
router.post("/add", addShayari);      
router.delete("/:id", deleteShayari); 
router.put("/:id", updateShayari);   

module.exports = router;
