require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();

// Database connection
connectDB().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth.routes.js');
const donationRoutes = require('./src/routes/donatation.route.js'); // Fixed typo in filename
const certificateRoutes = require('./src/routes/generators.js'); 

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/auth', authRoutes); 
app.use('/api/donations', donationRoutes); // Added a more specific route for donations
app.use('/api/certificates', certificateRoutes); // Added a more specific route for certificates

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

module.exports = app;
