const dns = require("dns");
dns.setServers(['8.8.8.8', '8.8.4.4']); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[DATABASE] 🟢 MongoDB Successfully Connected'))
  .catch((err) => console.log('[DATABASE] 🔴 Connection Failed:', err.message));

// Test Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "FinanceWise API is running." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] 🔥 Running on http://0.0.0.0:${PORT}`);
});