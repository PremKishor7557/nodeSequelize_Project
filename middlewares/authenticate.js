const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  //const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  // Retrieve the token from the cookie
  const token = req.cookies.authToken; // Assuming the token is stored in a cookie named 'authToken'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user information from the token in req.user
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// const isAuthenticated = (req, res, next) => {
//   if (req.session.isAuthenticated) {
//     // If the user is authenticated, proceed to the next middleware or route handler
//     next();
//   } else {
//     // If the user is not authenticated, return a 401 Unauthorized response
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

const isAuthenticated = (req, res, next) => {
  console.log('Inside isAuthenticated middleware');
  if (req.session && req.session.isAuthenticated) {
      // Proceed to the next middleware or route handler if authenticated
      next();
  } else {
      // If not authenticated, return a 401 Unauthorized response
      res.status(401).json({ message: 'Unauthorized' });
  }
};


module.exports = {
    authenticateToken,
    isAuthenticated
};
