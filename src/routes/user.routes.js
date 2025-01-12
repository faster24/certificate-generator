const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Protected route
router.get('/profile', authMiddleware.authenticate, (req, res) => {
  res.status(200).json({ message: 'Access granted to profile', user: req.user });
});

module.exports = router;
