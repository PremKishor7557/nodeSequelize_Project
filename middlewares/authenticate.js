const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Premshankarki$hor';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store user information from the token in req.user
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
//process.env.JWT_SECRET
module.exports = authenticateToken;
