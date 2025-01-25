const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/cryptoUtils'); // Assuming you have utility functions for encryption

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    encryptionKey: { type: String, required: true },
    balance: {
        type: mongoose.Schema.Types.Mixed,  // Use Mixed type to allow for any object
        required: true,
        default: {}, // Ensure an empty object is the default value
        set: function (data) {
            if (data && typeof data === 'object') {
                return encrypt(JSON.stringify(data), this.encryptionKey);  // Encrypt using user's encryptionKey
            }
            return encrypt(JSON.stringify({}), this.encryptionKey);  // Encrypt empty object if no balance data
        },
        get: function (data) {
            if (data) {
                return JSON.parse(decrypt(data, this.encryptionKey));  // Decrypt using user's decryptionKey
            }
            return {};  // Return empty object if no data exists
        },
    },
    createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to rotate encryption/decryption keys
userSchema.methods.rotateKeys = async function () {
    const newEncryptionKey = crypto.randomBytes(32).toString('hex');
    
    this.encryptionKey = newEncryptionKey;
    await this.save();
};

userSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('User', userSchema);
