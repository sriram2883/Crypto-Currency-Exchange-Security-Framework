const mongoose = require('mongoose');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const User = require('./userSchema');  // Assuming User schema is exported properly

const transactionSchema = new mongoose.Schema({
    involvedUser: { type: String, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    action: { type: String, required: true },  // Action: Sent, Received, Purchased, Sold
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    hash: { type: String },
    timestamp: { type: Date, default: Date.now },
    encryptedData: {
        type: String, // Encrypted transaction details
    }
});

// Hash the transaction and encrypt the data before saving
transactionSchema.pre('save', async function (next) {
    try {
        // Ensure that all required fields are set
        if (!this.sender || !this.recipient || !this.coin || !this.amount) {
            return next(new Error('Missing required transaction fields.'));
        }

        const data = `${this.sender}-${this.recipient}-${this.coin}-${this.amount}-${this.timestamp}`;
        const salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.createHmac('sha256', salt).update(data).digest('hex');
        // Fetch the involved user's encryption key (same as decryption key)
        const user = await User.findOne({ username: this.involvedUser });
        if (!user) {
            return next(new Error('User not found'));  // Handle user not found error
        }

        // Encrypt the transaction data using the user's encryptionKey
        const encrypted = encrypt(JSON.stringify({
            sender: this.sender,
            recipient: this.recipient,
            coin: this.coin,
            amount: this.amount,
            timestamp: this.timestamp
        }), user.encryptionKey);

        // Ensure encryption was successful
        if (!encrypted) {
            return next(new Error('Encryption failed'));
        }   
        console.log('Encrypted data:', encrypted);

        // Assign encrypted data to the document
        this.encryptedData = encrypted;

        // Proceed to the next middleware
        next();

    } catch (error) {
        console.error('Error during transaction save:', error);
        return next(error);  // Pass the error to Mongoose if any operation fails
    }
});

// Method to decrypt the encryptedData
transactionSchema.methods.decryptData = async function () {
    try {
        // Fetch the involved user's encryption key (same as decryption key)
        const user = await User.findOne({ username: this.involvedUser });
        if (!user) {
            throw new Error('User not found');
        }

        // Decrypt the transaction data using the user's encryption key
        return decrypt(this.encryptedData, user.encryptionKey);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Decryption failed: ' + error.message);
    }
};

module.exports = mongoose.model('Transaction', transactionSchema);
