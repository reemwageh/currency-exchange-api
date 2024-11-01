const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../config/swaggerConfig'); 
const exchangeRoutes = require('./routes/exchangeRoutes'); // Path to your routes
const rateLimit = require('express-rate-limit'); // Import the rate limit module

dotenv.config(); // Load environment variables from .env file
const app = express();

app.use(express.json()); // Middleware to parse JSON

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Configure the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter to all API routes
app.use('/api', limiter, exchangeRoutes); // Register API routes with the rate limiter

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server

module.exports = app; // Export the app for testing or further use
