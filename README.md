# KeyWizard.com

A comprehensive platform for discovering, sharing, and managing custom keyboard shortcut collections. KeyWizard.com serves as the community hub for keyboard shortcut enthusiasts, providing a centralized repository of shortcut packages that can be imported into the KeyWizard desktop application.

## 🌐 Live Site

[https://key-wizard.com](https://key-wizard.com)

## 🎯 Purpose

KeyWizard.com is designed to be the go-to destination for keyboard shortcut enthusiasts. The platform allows users to:

- **Discover** shortcut packages for popular applications and workflows
- **Share** custom shortcut collections with the community
- **Download** shortcut packages in KeyWizard-compatible JSON format
- **Collaborate** on improving productivity through better keyboard shortcuts.

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

## 🚀 Deployment

### Production Environment
- **Hosting**: [Render](https://render.com/) with persistent disk
- **Domain**: Custom domain with HTTPS ([key-wizard.com](https://key-wizard.com))
- **Database**: SQLite with WAL mode for better concurrency
- **CDN**: Static assets served via Render's CDN

## 🙏 Acknowledgments

- **KeyWizard team**: My amazing team members and mentors behind KeyWizard itself.
- **KeyWizard Desktop App**: The companion application that makes this platform valuable
- **Community**: All contributors and users who share their shortcut packages
- **Open Source**: Built with amazing open-source tools and libraries

## ✍️ Authors

- Laurie Byrne: https://github.com/Byrnel68
- Ciaran Coady: https://github.com/ciarancoady98
- Kamil Przepiorowski: https://github.com/kamilprz 


---

**KeyWizard.com** — Empowering productivity through keyboard shortcuts! ⌨️✨


*Connect with the KeyWizard desktop app to unlock the full potential of your keyboard shortcuts.*
