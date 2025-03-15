const express = require("express");
const { getShayaris, addShayari, deleteShayari, updateShayari } = require("../../controllers/Duggu-Ramz/shayariController");

const router = express.Router();

router.get("/", getShayaris);      
router.post("/", addShayari);      
router.delete("/:id", deleteShayari); 
router.put("/:id", updateShayari);   

module.exports = router;
