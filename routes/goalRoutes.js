const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/authMiddleware');
// GET: Fetch all goals
router.get('/', auth, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new goal
router.post('/', auth, async (req, res) => {
    try {
        
        const newGoal = new Goal({
            ...req.body,
            user: req.user.id  
        });
        const savedGoal = await newGoal.save();
        res.status(201).json(savedGoal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update a goal (Add funds)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },  // ADD user check
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedGoal) {
             return res.status(404).json({ message: "Goal not found or unauthorized" });
     }
      res.status(200).json(updatedGoal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });  // ADD user check
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found or unauthorized" });
     }
      res.status(200).json({ message: "Goal deleted" });
} catch (err) {
    console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;