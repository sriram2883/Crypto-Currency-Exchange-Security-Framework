const JWT = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    
    if (!token) return res.status(403).json({ message: 'Access denied, no token provided.' });

    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).json({ message: 'Invalid token.' });

        req.user = user; // Attach user info to the request object
        next();
    });
};

module.exports = authenticateToken;
