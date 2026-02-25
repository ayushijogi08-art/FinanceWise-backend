const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Transaction = require('../models/Transaction'); // Adjust path if your model file is named differently
const authMiddleware = require('../middleware/auth');
// 1. REGISTER A NEW USER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        // Create the user (The User.js model automatically scrambles the password)
        const newUser = new User({ name, email, password });
        const savedUser = await newUser.save();

        // Generate the VIP Pass (Valid for 30 days)
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Send the token and user data back to the Flutter app
        res.status(201).json({ 
            token, 
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN AN EXISTING USER
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found. Please register first." });

        // Compare the typed password with the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        // Generate the VIP Pass
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ==========================================
// 1. GENERATE OTP & SEND EMAIL
// ==========================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate a random 6-digit number
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database and set expiry to 10 minutes from now
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; 
        await user.save();

        // Fire the email
        const message = `Your password reset code is ${otp}. It will expire in 10 minutes. Do not share this code with anyone.`;
        await sendEmail({
            email: user.email,
            subject: 'FinanceWise - Password Reset Code',
            message: message
        });

        res.status(200).json({ message: "OTP sent to email successfully." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error sending email." });
    }
});

// ==========================================
// 2. VERIFY THE OTP
// ==========================================
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });

        // Check if OTP matches AND if time hasn't expired
        if (user.resetOtp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Server error verifying OTP." });
    }
});

// ==========================================
// 3. SET NEW PASSWORD
// ==========================================
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });

         const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // SECURE THE VAULT: Wipe the OTP data so it cannot be reused
        user.resetOtp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error resetting password." });
    }
});
// ==========================================
// 4. DELETE ACCOUNT & TRANSACTIONS
// ==========================================
router.delete('/delete-account', authMiddleware, async (req, res) => {
    try {
        // req.user.id comes securely from the authMiddleware, not from the app
        const userId = req.user.id; 

        // 1. Destroy all transactions belonging to this user FIRST
        await Transaction.deleteMany({ user: userId }); 

        // 2. Destroy the user account SECOND
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account and transactions deleted successfully." });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ message: "Server error during deletion." });
    }
});
module.exports = router;