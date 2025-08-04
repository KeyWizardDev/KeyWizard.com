# KeyWizard.com

A comprehensive platform for discovering, sharing, and managing custom keyboard shortcut collections. KeyWizard.com serves as the community hub for keyboard shortcut enthusiasts, providing a centralized repository of shortcut packages that can be imported into the KeyWizard desktop application.

## 🌐 Live Site

[https://key-wizard.com](https://key-wizard.com)

## 🎯 Purpose

KeyWizard.com is designed to be the go-to destination for keyboard shortcut enthusiasts. The platform allows users to:

- **Discover** shortcut packages for popular applications and workflows
- **Share** custom shortcut collections with the community
- **Download** shortcut packages in KeyWizard-compatible JSON format
- **Collaborate** on improving productivity through better keyboard shortcuts

The website works in conjunction with the **KeyWizard desktop application**, which is available on the Microsoft Store:

### 🔗 KeyWizard Desktop App

**[Download KeyWizard on Microsoft Store](https://apps.microsoft.com/detail/9nf4pjffzzms?hl=en-US&gl=US)**

The KeyWizard desktop application allows you to:
- Import shortcut packages from KeyWizard.com
- Execute custom keyboard shortcuts
- Create and manage your own shortcut collections
- Boost productivity with personalized keyboard workflows

---

## 🚀 Features

### Core Functionality
- **Google OAuth Authentication**: Secure sign-in with your Google account
- **Multi-user Support**: Each user manages their own shortcut packages
- **Real-time Updates**: Live updates via Socket.io when packages are created, modified, or deleted
- **Advanced Search**: Real-time search functionality with category filtering
- **Package Export**: Download packages in KeyWizard-compatible JSON format

### Package Management
- **Create & Edit**: Build custom shortcut packages with dynamic forms
- **Category System**: Organize packages by category (Development, Design, Productivity, etc.)
- **Rich Metadata**: Include descriptions, categories, and author information
- **Copy to Clipboard**: Quick copy functionality for package data

### User Experience
- **Modern UI**: Warm, playful, and minimalist design with branding and Lucide icons
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Toast notifications for all user actions
- **Category Icons**: Visual category indicators for easy navigation

### Technical Features
- **SQLite Database**: Persistent, file-based storage with optimized performance
- **Production Ready**: Deployed on Render with custom domain and HTTPS
- **Database Migration**: Automated package seeding and updates
- **Error Handling**: Robust error handling and graceful degradation

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.io** for real-time communication
- **SQLite** database with WAL mode for better concurrency
- **Passport.js** with Google OAuth 2.0
- **JWT** and session management
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side navigation
- **Socket.io Client** for real-time updates
- **Lucide React** for consistent iconography
- **Modern CSS** with custom branding and animations

## 🎯 Usage

### For Users
1. **Browse Packages**: Explore shortcut collections by category or search
2. **Sign In**: Log in with Google to create and manage your own packages
3. **Download**: Save packages in KeyWizard-compatible format
4. **Import**: Use downloaded packages with the KeyWizard desktop app

### For Package Creators
1. **Create**: Build custom shortcut packages with our dynamic form system
2. **Organize**: Categorize packages for easy discovery
3. **Share**: Make your packages available to the community
4. **Manage**: Edit and update your packages as needed

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `google_id`: Google OAuth ID
- `email`: User email
- `name`: Display name
- `avatar_url`: Profile picture URL
- `created_at`: Account creation timestamp

### Shortcut Packages Table
- `id`: Primary key
- `name`: Package name
- `description`: Package description
- `category`: Package category
- `author_id`: Foreign key to users table
- `author_name`: Author display name
- `shortcuts`: JSON array of shortcuts
- `image_url`: Package icon URL
- `downloads`: Download counter
- `rating`: Average rating
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## 🔧 API Endpoints

### Package Management
- `GET /api/packages` — List all packages with filtering
- `GET /api/packages/:id` — Get package by ID
- `POST /api/packages` — Create new package (auth required)
- `PUT /api/packages/:id` — Update package (auth required)
- `DELETE /api/packages/:id` — Delete package (auth required)

### Authentication
- `GET /api/auth/google` — Start Google OAuth flow
- `GET /api/auth/google/callback` — OAuth callback handler
- `GET /api/auth/me` — Get current user information
- `GET /api/auth/logout` — Logout user

### Real-time Events
- `packageAdded` — New package created
- `packageUpdated` — Package modified
- `packageDeleted` — Package removed

## 🚀 Deployment

### Production Environment
- **Hosting**: [Render](https://render.com/) with persistent disk
- **Domain**: Custom domain with HTTPS ([key-wizard.com](https://key-wizard.com))
- **Database**: SQLite with WAL mode for better concurrency
- **CDN**: Static assets served via Render's CDN

### Environment Variables
```bash
PORT=3000
DATABASE_PATH=/data/keywizard.sqlite
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://key-wizard.com/api/auth/google/callback
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

### Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Configure **Authorized JavaScript origins**:
   - `https://key-wizard.com`
   - `https://www.key-wizard.com`
4. Configure **Authorized redirect URIs**:
   - `https://key-wizard.com/api/auth/google/callback`
   - `https://www.key-wizard.com/api/auth/google/callback`
5. Add credentials to your deployment environment

## 🔄 Development

### Local Setup
```bash
# Clone the repository
git clone https://github.com/your-username/KeyWizard.com.git
cd KeyWizard.com

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Google OAuth credentials

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` — Start development server (frontend + backend)
- `npm run server` — Start backend server only
- `npm run client` — Start frontend development server
- `npm run build` — Build for production
- `npm run migrate` — Run database migrations

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/KeyWizard.com/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/KeyWizard.com/discussions)
- **Email**: support@key-wizard.com

## 🙏 Acknowledgments

- **KeyWizard Desktop App**: The companion application that makes this platform valuable
- **Community**: All contributors and users who share their shortcut packages
- **Open Source**: Built with amazing open-source tools and libraries

---

**KeyWizard.com** — Empowering productivity through keyboard shortcuts! ⌨️✨

*Connect with the KeyWizard desktop app to unlock the full potential of your keyboard shortcuts.*
