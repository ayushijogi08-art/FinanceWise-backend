const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

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

module.exports = router;