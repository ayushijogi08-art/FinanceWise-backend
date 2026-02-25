const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Prevents two accounts with the same email
    },
    password: { 
        type: String, 
        required: true 
    },
    resetOtp: { 
        type: String,
         default: null 
        },
    otpExpiry: {
         type: Date,
          default: null 
        }
}, { timestamps: true });

// ENCRYPTION ENGINE: Automatically hash the password before saving
userSchema.pre('save', async function() {
    // If the password hasn't been changed, do nothing and let Mongoose continue
    if (!this.isModified('password')) return;
    
    // Generate a salt and scramble the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Notice: No next() required. The 'async' keyword handles the continuation automatically.
});
module.exports = mongoose.model('User', userSchema);