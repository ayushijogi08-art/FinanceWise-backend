const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); 
const auth = require('../middleware/authMiddleware'); // The Bouncer

// 1. GET ALL TRANSACTIONS
// THE FIX: Notice 'auth' is now physically guarding the route
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
         const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).skip(skip).limit(limit);
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADD A NEW TRANSACTION
// THE FIX: 'auth' is guarding the route so req.user.id actually exists
router.post('/', auth, async (req, res) => {
    console.log("🚨 [SERVER] INCOMING TRANSACTION POST REQUEST!");
    console.log("🚨 [SERVER] DATA RECEIVED:", req.body);
    
    try {
        const newTransaction = new Transaction({
            ...req.body,
            user: req.user.id // This will now work perfectly
        });
        
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. EDIT A TRANSACTION
// THE FIX: 'auth' is added, and the made-up command is fixed to 'findOneAndUpdate'
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Not found or unauthorized." });
        }
        res.status(200).json(updatedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE A TRANSACTION
// THE FIX: 'auth' is added, and the made-up command is fixed to 'findOneAndDelete'
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Not found or unauthorized." });
        }
        res.status(200).json({ message: "Transaction deleted permanently." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;