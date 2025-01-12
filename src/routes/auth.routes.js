const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ensure all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create a new user
    const user = await User.create({ username, email, password });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res
        .status(400)
        .json({ error: `${duplicateField} already exists.` });
    }
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
