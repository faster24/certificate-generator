const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message }); // Fixed typo: `staus` -> `status`
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

