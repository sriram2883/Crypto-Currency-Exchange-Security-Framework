const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Transaction = require('../models/transactionSchema');
const authenticateToken = require('../middlewares/authenticateToken');

// Route to fetch user details for portfolio
router.get('/api/user/details', authenticateToken, async (req, res) => {
    try {
        // Fetch the user from the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch the user's transactions
        const transactions = await Transaction.find({involvedUser: user.username}).sort({ timestamp: -1 }); // Sort by most recent transactions

        // Structure the data for the frontend
        const userDetails = {
            username: user.username,
            balance: user.balance, // Object with coins and their amounts
            transactions: transactions.map(tx => ({
                sender: tx.sender,
                recipient: tx.recipient,
                coin: tx.coin,
                action: tx.action,
                amount: tx.amount,
                hash: tx.hash,
                timestamp: tx.timestamp
            }))
        };

        // Send the user details
        res.status(200).json({ message: 'User details fetched successfully.', userDetails });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
});

module.exports = router;
