const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { requireAuth, getUserById } = require('../middleware/auth');

const router = express.Router();
const db = new sqlite3.Database('./server/database.sqlite');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set JWT token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.redirect('/');
  }
);

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's packages
    db.all('SELECT id, name, description, category, created_at FROM shortcut_packages WHERE author_id = ? ORDER BY created_at DESC', 
      [req.params.id], (err, packages) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          user: {
            id: user.id,
            username: user.username,
            avatar_url: user.avatar_url,
            created_at: user.created_at
          },
          packages: packages
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 