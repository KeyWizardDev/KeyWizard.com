const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DATABASE_PATH || './server/database.sqlite');

// Function to validate and fix Google avatar URL
const validateAvatarUrl = (url) => {
  if (!url) return null;
  
  // Google avatar URLs sometimes need to be modified for better compatibility
  // Remove size parameters and ensure HTTPS
  let cleanUrl = url;
  
  // Ensure HTTPS
  if (cleanUrl.startsWith('http://')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  }
  
  // Remove size parameters that might cause issues
  cleanUrl = cleanUrl.replace(/=s\d+(-c)?/, '=s96-c');
  
  return cleanUrl;
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Debug logging
      console.log('Google OAuth profile received:', {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatarUrl: profile.photos?.[0]?.value
      });
      
      // Check if user already exists
      db.get('SELECT * FROM users WHERE google_id = ?', [profile.id], async (err, user) => {
        if (err) {
          console.error('Database error checking existing user:', err);
          return done(err, null);
        }
        
        if (user) {
          // User exists, check if we need to update avatar_url
          const originalAvatarUrl = user.avatar_url;
          const newAvatarUrl = validateAvatarUrl(profile.photos[0]?.value);
          
          if (originalAvatarUrl !== newAvatarUrl && newAvatarUrl) {
            // Update avatar URL if it's different
            db.run('UPDATE users SET avatar_url = ? WHERE id = ?', [newAvatarUrl, user.id], (err) => {
              if (err) {
                console.error('Error updating avatar URL:', err);
              } else {
                console.log('Updated avatar URL for user:', user.id);
                user.avatar_url = newAvatarUrl;
              }
            });
          }
          
          console.log('Existing user found:', user);
          return done(null, user);
        } else {
          // Create new user
          const newUser = {
            google_id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar_url: validateAvatarUrl(profile.photos[0]?.value)
          };
          
          console.log('Creating new user:', newUser);
          
          db.run(
            'INSERT INTO users (google_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
            [newUser.google_id, newUser.username, newUser.email, newUser.avatar_url],
            function(err) {
              if (err) {
                console.error('Database error creating new user:', err);
                return done(err, null);
              }
              
              // Get the newly created user
              db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user) => {
                if (err) {
                  console.error('Database error fetching new user:', err);
                  return done(err, null);
                }
                console.log('New user created:', user);
                return done(null, user);
              });
            }
          );
        }
      });
    } catch (error) {
      console.error('Google OAuth strategy error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    done(err, user);
  });
});

module.exports = passport; 