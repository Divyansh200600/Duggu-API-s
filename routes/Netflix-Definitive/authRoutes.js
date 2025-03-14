const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/Netflix-definitive/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const { registerUser, loginUser } = require("../../controllers/Netflix-Definitive/auth/authController");

const otpStore = new Map();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId }).select("-password");
        console.log(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000;

        otpStore.set(email, { otp, otpExpires });

        await sendEmail(email, otp);

        res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!otp) {
        return res.status(400).json({ success: false, message: "OTP is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const storedOtp = otpStore.get(email);

        if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        otpStore.delete(email);

        res.json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

async function sendEmail(email, otp) {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Netflix - Password Reset OTP",
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = router;
