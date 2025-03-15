const mongoose = require('mongoose');

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    profileImage: String,
}));

const Expense = mongoose.models.Expense || mongoose.model('Expense', new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shopName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    category: String,
    latitude: Number,
    longitude: Number,
    items: [{
        name: String,
        price: Number,
        category: String,
    }],
}));

module.exports = { User, Expense };
