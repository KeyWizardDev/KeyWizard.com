const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database(process.env.DATABASE_PATH || './server/database.sqlite');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to get user info (optional auth)
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we don't block the request
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

// Get user by ID
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Check if user owns a package
const checkPackageOwnership = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const userId = req.user.id;

    db.get('SELECT author_id FROM shortcut_packages WHERE id = ?', [packageId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      if (row.author_id !== userId) {
        return res.status(403).json({ error: 'Access denied. You can only edit your own packages.' });
      }
      
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
  getUserById,
  checkPackageOwnership
}; 