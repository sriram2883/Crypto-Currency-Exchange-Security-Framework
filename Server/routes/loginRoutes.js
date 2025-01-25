const express = require('express');
const JWT = require('jsonwebtoken');
const User = require('../models/userSchema');
const Transaction = require('../models/transactionSchema');
const authenticateToken = require('../middlewares/authenticateToken');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/cryptoUtils'); // Utility functions for encryption and decryption

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Generate initial encryption and decryption keys for the new user
        const encryptionKey = crypto.randomBytes(32).toString('hex');

        // Encrypt an empty object as the initial balance
        const encryptedBalance = encrypt(JSON.stringify({}), encryptionKey);

        // Create a new user instance
        const user = new User({ 
            username, 
            password, 
            balance: encryptedBalance,  // Pass the encrypted empty object
            encryptionKey
        });

        // Save the user
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and rotate keys
 * @access  Public
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        var userbalance = user.balance;
        const transactions = await Transaction.find({
            involvedUser: user.username // Using 'involvedUser' to search for the user as sender or recipient
        });
        // Rotate encryption and decryption keys
        await user.rotateKeys();
        user.balance = userbalance;
        // Re-encrypt user's past transactions with the new keys


        for (let transaction of transactions) {
            // Re-encrypt transaction data with the new keys
            const encryptedData = encrypt(JSON.stringify({
                sender: transaction.sender,
                recipient: transaction.recipient,
                coin: transaction.coin,
                amount: transaction.amount,
                timestamp: transaction.timestamp
            }), user.encryptionKey);
            transaction.encryptedData = encryptedData;
            await transaction.save();
        }
        await user.save();
        // Generate JWT token
        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the response with token
        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and rotate keys
 * @access  Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // console.log("logout");
        // Find the user by ID
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        let userbalance = user.balance;
        const transactions = await Transaction.find({
            involvedUser: user.username // Using 'involvedUser' to search for the user as sender or recipient
        });
        // Rotate encryption and decryption keys during logout
        await user.rotateKeys();

        user.balance = userbalance;
        // Re-encrypt user's transactions with the new keys


        for (let transaction of transactions) {
            // Re-encrypt transaction data with the new keys
            const encryptedData = encrypt(JSON.stringify({
                sender: transaction.sender,
                recipient: transaction.recipient,
                coin: transaction.coin,
                amount: transaction.amount,
                timestamp: transaction.timestamp
            }), user.encryptionKey);
            transaction.encryptedData = encryptedData;
            await transaction.save();
        }
        await user.save();
        // Send the response indicating successful logout
        res.status(200).json({ message: 'Logout successful. Keys rotated and transactions updated.' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
