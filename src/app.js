require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db.js');

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
const authRoutes = require('./routes/auth.routes.js');
const donationRoutes = require('./routes/donatation.route.js'); 
const certificateRoutes = require('./routes/generators.js'); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes); 
app.use('/api', donationRoutes);
app.use('/api', certificateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
