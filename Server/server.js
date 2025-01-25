const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const rateLimiter = require('./middlewares/rateLimiter.js');
const authRoutes = require('./routes/loginRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');
const authenticateToken = require('./middlewares/authenticateToken.js');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS Configuration - Allow All
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
    credentials: false, // Disallow credentials (since all origins are allowed)
  })
);

// Connect to Database
connectDB();

// Rate Limiting
app.use(rateLimiter);

app.get('/',authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Server is running.', userDetails: req.user });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/user', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
