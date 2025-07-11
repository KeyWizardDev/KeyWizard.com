# KeyWizard.com Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
cd client && npm install
cd ..
```

### 2. Google OAuth Setup

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Copy your Client ID and Client Secret

#### Step 2: Configure Environment Variables
1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your Google OAuth credentials:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_here

   # Session Secret (generate a random string)
   SESSION_SECRET=your_super_secret_session_key_here

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

#### Step 3: Generate Secure Secrets
You can generate secure secrets using:
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the Application
```bash
# Start both backend and frontend
npm run dev

# Or use the convenience script
./start.sh
```

## 🔧 Features

### ✅ Authentication System
- **Google OAuth 2.0** sign-in/sign-up
- **JWT tokens** for secure authentication
- **Session management** with cookies
- **User profiles** with avatars and information

### ✅ User Management
- **Automatic user creation** on first Google sign-in
- **User profiles** showing created packages
- **Package ownership** - users can only edit their own packages
- **Real-time user status** in the header

### ✅ Enhanced Package System
- **Author relationships** - packages are linked to user accounts
- **Author avatars** displayed throughout the app
- **Ownership controls** - only package creators can edit/delete
- **User-specific actions** - edit/delete buttons only show for owners

### ✅ Security Features
- **Protected routes** requiring authentication
- **CSRF protection** with secure cookies
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/packages
- **Google OAuth**: http://localhost:3000/api/auth/google
- **User Profile**: http://localhost:5173/profile

## 🔍 Testing the Authentication

1. **Start the application**: `npm run dev`
2. **Visit the app**: http://localhost:5173
3. **Click "Sign In"** in the header
4. **Choose "Sign in with Google"**
5. **Complete Google OAuth flow**
6. **Verify you're logged in** - you should see your name in the header
7. **Try creating a package** - you should now be able to create packages
8. **Check your profile** - visit `/profile` to see your packages

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Packages Table (Updated)
```sql
CREATE TABLE shortcut_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  author_id INTEGER NOT NULL,
  author_name TEXT NOT NULL,
  category TEXT,
  shortcuts TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/user/:id` - Get user profile and packages

### Packages (Protected)
- `GET /api/packages` - Get all packages (public)
- `GET /api/packages/:id` - Get specific package (public)
- `POST /api/packages` - Create package (authenticated)
- `PUT /api/packages/:id` - Update package (owner only)
- `DELETE /api/packages/:id` - Delete package (owner only)

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure your redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"JWT_SECRET not defined" error**
   - Ensure your `.env` file exists and has the JWT_SECRET variable
   - Restart the server after adding environment variables

3. **"Database locked" error**
   - The SQLite database might be locked by another process
   - Restart the application

4. **CORS errors**
   - Ensure the frontend is running on port 5173
   - Check that credentials are included in requests

### Debug Mode
To enable debug logging, set in your `.env`:
```env
NODE_ENV=development
DEBUG=passport:*
```

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- **Use strong, unique secrets** for JWT_SECRET and SESSION_SECRET
- **Enable HTTPS in production** for secure cookie transmission
- **Regularly rotate secrets** in production environments
- **Monitor OAuth usage** in Google Cloud Console

## 🚀 Production Deployment

1. **Set up HTTPS** for secure cookie transmission
2. **Update redirect URIs** in Google Console for your domain
3. **Set NODE_ENV=production** in environment variables
4. **Use a production database** (PostgreSQL, MySQL) instead of SQLite
5. **Set up proper logging** and monitoring
6. **Configure rate limiting** and security headers

---

**KeyWizard.com** - Now with secure multi-user authentication! 🔐✨ 