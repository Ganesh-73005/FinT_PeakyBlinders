const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { User, Expense } = require('./models'); // Import models

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection with Error Handling
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes

// Get user by ID
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all expenses for a user
app.get('/api/expenses/:user_id', async (req, res) => {
    try {
        const expenses = await Expense.find({ user_id: req.params.user_id });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Failed to save expense" });
    }
});

// Upload GST bill and categorize expenses
app.post('/api/upload-gst-bill', async (req, res) => {
    const { user_id, image_url } = req.body;

    try {
        // Send image to Flask backend for processing
        const response = await axios.post('http://localhost:5001/extract-and-categorize', { file: image_url });

        if (!response.data.gst_number) {
            return res.status(400).json({ error: "No GST number found" });
        }

        const { gst_number, categories, address } = response.data;

        // Save expense to MongoDB
        const newExpense = new Expense({
            user_id,
            shopName: "Scanned Bill",
            amount: categories.reduce((sum, item) => sum + parseFloat(item.expense), 0),
            date: new Date(),
            category: "Scanned Bill",
            latitude: 12.9716, // Example latitude
            longitude: 77.5946, // Example longitude
            items: categories.map(item => ({
                name: item.category,
                price: item.expense,
                category: item.category,
            })),
        });

        await newExpense.save();
        res.json(newExpense);
    } catch (error) {
        console.error("Error processing GST bill:", error);
        res.status(500).json({ error: "Failed to process GST bill" });
    }
});

// Search for products
app.get('/api/search-products', async (req, res) => {
    const { query, user_id } = req.query;

    try {
        const expenses = await Expense.find({ user_id, 'items.name': { $regex: query, $options: 'i' } });
        res.json(expenses);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
