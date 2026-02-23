const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    // THE CHAIN: This locks the goal to a specific user account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    targetAmount: { 
        type: Number, 
        required: true,
        min: [1, 'Target must be greater than zero']
    },
    savedAmount: { 
        type: Number, 
        default: 0,
        min: [0, 'Saved amount cannot be negative']
    },
    deadline: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);