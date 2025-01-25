const crypto = require('crypto');

// Encryption function
function encrypt(text, encryptionKey) {
    // Ensure the encryption key is 32 bytes (256 bits)
    const key = Buffer.from(encryptionKey, 'hex');
    if (key.length !== 32) {
        throw new Error('Encryption key must be 32 bytes (256 bits)');
    }

    // Generate a random IV (Initialization Vector) - 16 bytes
    const iv = crypto.randomBytes(16);

    // Create the cipher using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted text combined (IV + encrypted)
    return iv.toString('hex') + encrypted;
}

// Decryption function
function decrypt(encrypted, decryptionKey) {
    // Ensure the decryption key is 32 bytes (256 bits)
    const key = Buffer.from(decryptionKey, 'hex');
    if (key.length !== 32) {
        throw new Error('Decryption key must be 32 bytes (256 bits)');
    }

    // Extract the IV from the first 16 bytes (32 hex characters)
    const iv = Buffer.from(encrypted.substring(0, 32), 'hex');
    const encryptedText = encrypted.substring(32);

    // Create the decipher using AES-256-CBC
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the encrypted text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };
