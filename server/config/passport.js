const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DATABASE_PATH || './server/database.sqlite');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      db.get('SELECT * FROM users WHERE google_id = ?', [profile.id], async (err, user) => {
        if (err) {
          return done(err, null);
        }
        
        if (user) {
          // User exists, return user
          return done(null, user);
        } else {
          // Create new user
          const newUser = {
            google_id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar_url: profile.photos[0]?.value || null
          };
          
          db.run(
            'INSERT INTO users (google_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
            [newUser.google_id, newUser.username, newUser.email, newUser.avatar_url],
            function(err) {
              if (err) {
                return done(err, null);
              }
              
              // Get the newly created user
              db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user) => {
                if (err) {
                  return done(err, null);
                }
                return done(null, user);
              });
            }
          );
        }
      });
    } catch (error) {
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