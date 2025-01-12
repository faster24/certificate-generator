const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer token

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;  // Attach user info to request
    next();
  });
};

module.exports = authenticateJWT;
