const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const User = require('../models/userSchema');
const Transaction = require('../models/transactionSchema');
const crypto = require('crypto');

const router = express.Router();

/**
 * @route   POST /api/transactions/buy
 * @desc    Buy coins
 * @access  Private
 */
router.post('/buy', authenticateToken, async (req, res) => {
    const { coin, amount } = req.body;

    if (!coin || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input: Coin and positive amount are required.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Add purchased coins to the user's balance
        let currentBalance = user.balance;
        currentBalance[coin] = (currentBalance[coin] || 0) + amount;
        user.balance = currentBalance;

        // Log the transaction for the user (as "involvedUser")
        const transaction = new Transaction({
            involvedUser: user.username, // Updated field name
            sender: user.username,
            recipient: user.username,
            action: 'Purchased', // Updated field name
            coin,
            amount,
            timestamp: Date.now(),
        });
        console.log('Transaction:', transaction);

        await transaction.save();
        await user.save();

        res.status(200).json({
            message: 'Coins bought successfully.',
            balance: user.balance,
            transactionHash: transaction.hash,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @route   POST /api/transactions/sell
 * @desc    Sell coins
 * @access  Private
 */
router.post('/sell', authenticateToken, async (req, res) => {
    const { coin, amount } = req.body;

    if (!coin || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input: Coin and positive amount are required.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const currentBalance = user.balance[coin] || 0;
        if (currentBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        // Deduct sold coins from the user's balance
        var newBalance = user.balance;
        newBalance[coin] -= amount;
        user.balance = newBalance;               
        // Log the transaction for the user (as "involvedUser")
        const transaction = new Transaction({
            involvedUser: user.username, // Updated field name
            sender: user.username,
            action: 'Sold', // Updated field name
            recipient: user.username,
            coin,
            amount,
            timestamp: Date.now(),
        });

        await transaction.save();
        await user.save();

        res.status(200).json({
            message: 'Coins sold successfully.',
            balance: user.balance,
            transactionHash: transaction.hash,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @route   POST /api/transactions/transfer
 * @desc    Transfer coins to another user
 * @access  Private
 */
router.post('/transfer', authenticateToken, async (req, res) => {
    const { recipientUsername, coin, amount } = req.body;

    if (!recipientUsername || !coin || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid input: Recipient, coin, and positive amount are required.' });
    }

    try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findOne({ username: recipientUsername });

        if (!sender) return res.status(404).json({ message: 'Sender not found.' });
        if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });

        var senderBalance = sender.balance;
        if (!senderBalance[coin] || senderBalance[coin] < amount) {
            return res.status(400).json({ message: 'Insufficient balance to complete the transfer.' });
        }

        // Deduct transferred coins from the sender's balance
        senderBalance[coin] -= amount;
        sender.balance = senderBalance;
        var recipientBalance = recipient.balance;
        recipientBalance[coin] = (recipientBalance[coin] || 0) + amount;
        recipient.balance = recipientBalance;

        // Log the transaction for both sender and recipient
        const transactionSender = new Transaction({
            involvedUser: sender.username, // Updated field name
            sender: sender.username,
            recipient: recipient.username,
            action: 'Sent', // Updated field name
            coin,
            amount,
            timestamp: Date.now(),
        });
        const transactionRecipient = new Transaction({
            involvedUser: recipient.username, // Updated field name
            sender: sender.username,
            recipient: recipient.username,
            action: 'Received', // Updated field name
            coin,
            amount,
            timestamp: Date.now(),
        });

        await transactionSender.save();
        await transactionRecipient.save();
        await sender.save();
        await recipient.save();

        res.status(200).json({
            message: 'Coins transferred successfully.',
            transactionHash: transactionSender.hash,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
