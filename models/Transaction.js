const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // A transaction CANNOT exist without an owner
    },
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: [0.01, 'Amount cannot be zero or negative'] // The idiot-proof check
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    category: { 
        type: String, 
        required: true 
    },
    isExpense: { 
        type: Boolean, 
        required: true 
    },
    isRecurring: { 
        type: Boolean, 
        default: false 
    },
    nextRecurringDate: { type: Date }
    
}, { timestamps: true }); // Automatically logs when the entry was created

module.exports = mongoose.model('Transaction', transactionSchema);