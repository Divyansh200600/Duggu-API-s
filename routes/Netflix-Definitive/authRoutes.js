const express = require("express");
const User = require("../../src/models/Netflix-definitive/User");
const { registerUser, loginUser } = require("../../controllers/Netflix-Definitive/auth/authController");

const router = express.Router();

// Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(`🔍 Fetching user with ID: ${userId}`);
  
      const user = await User.findOne({ userId }).select("-password");
      if (!user) {
        console.error("❌ User not found:", userId);
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (err) {
      console.error("❌ Error fetching user:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

module.exports = router;
