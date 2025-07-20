# KeyWizard.com

Platform for sharing and adding custom keyboard shortcut packages. Now live at:

## 🌐 Live Site

[https://key-wizard.com](https://key-wizard.com)

---

## 🚀 Features

- **Google OAuth Authentication**: Sign in with your Google account
- **Multi-user Support**: Each user manages their own shortcut packages
- **Real-time Updates**: Live updates via Socket.io when packages are created, modified, or deleted
- **Modern UI**: Warm, playful, and minimalist design with branding and Lucide icons
- **Package Management**: Create, edit, and delete keyboard shortcut packages
- **Dynamic Forms**: Add/remove shortcuts dynamically while creating packages
- **Real-time Notifications**: Toast notifications for all user actions
- **SQLite Database**: Persistent, file-based storage (with Render persistent disk)
- **Production Hosting**: Deployed on Render with custom domain and HTTPS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **SQLite** database (persistent disk on Render)
- **Passport.js** with Google OAuth 2.0
- **JWT** and session management
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** (Vite)
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Lucide React** for icons
- **Modern CSS** with custom branding

## 🎯 Usage

- **Browse**: View all public shortcut packages
- **Sign In**: Log in with Google to create and manage your own packages
- **Create/Edit/Delete**: Manage your packages from your profile
- **Real-time**: All users see updates instantly

## 🗄️ Database Schema

- **Users**: Google account-linked, each user owns their packages
- **Packages**: Linked to users, with name, description, category, and shortcuts (JSON)

## 🔧 API Endpoints

- `GET /api/packages` — List all packages
- `GET /api/packages/:id` — Get package by ID
- `POST /api/packages` — Create package (auth required)
- `PUT /api/packages/:id` — Update package (auth required)
- `DELETE /api/packages/:id` — Delete package (auth required)
- `GET /api/auth/google` — Start Google OAuth
- `GET /api/auth/google/callback` — OAuth callback
- `GET /api/auth/me` — Get current user info

## 🔌 Real-time Events

- `packageAdded`, `packageUpdated`, `packageDeleted` (Socket.io)

## 🚀 Deployment

### Production
- Hosted on [Render](https://render.com/)
- Persistent SQLite database (Render disk)
- Custom domain: [key-wizard.com](https://key-wizard.com)
- HTTPS enabled automatically

### Environment Variables
- `PORT`: Server port (default: 3000)
- `DATABASE_PATH`: Path to SQLite DB (e.g. `/data/keywizard.sqlite` on Render)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `GOOGLE_CALLBACK_URL`: e.g. `https://key-wizard.com/api/auth/google/callback`
- `SESSION_SECRET`: Session encryption key
- `JWT_SECRET`: JWT signing key

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set **Authorized JavaScript origins**:
   - `https://key-wizard.com`
   - (Optional) `https://www.key-wizard.com`
4. Set **Authorized redirect URIs**:
   - `https://key-wizard.com/api/auth/google/callback`
   - (Optional) `https://www.key-wizard.com/api/auth/google/callback`
5. Copy client ID/secret to your Render environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**KeyWizard.com** — Share the power of keyboard shortcuts! ⌨️✨
