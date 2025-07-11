# KeyWizard.com

Platform for users to share and add custom keyboard shortcut packages to their KeyWizard

## 🚀 Features

- **Real-time Updates**: Live updates when packages are created, modified, or deleted
- **Modern UI**: Beautiful, responsive design with glassmorphism effects
- **Package Management**: Create, edit, and delete keyboard shortcut packages
- **Dynamic Forms**: Add/remove shortcuts dynamically while creating packages
- **Real-time Notifications**: Toast notifications for all user actions
- **SQLite Database**: Lightweight, file-based database for easy deployment

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **SQLite** database
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and hot reloading
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Lucide React** for beautiful icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd KeyWizard.com
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both backend and frontend (recommended)
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 3000
   npm run client    # Frontend on port 5173
   ```

## 🎯 Usage

### Creating a Package
1. Click "Create Package" in the navigation
2. Fill in the package details (name, description, author, category)
3. Add keyboard shortcuts with key combinations, actions, and descriptions
4. Click "Create Package" to save

### Editing a Package
1. Navigate to any package detail page
2. Click the "Edit" button
3. Modify the package information and shortcuts
4. Click "Save" to update

### Real-time Features
- **Live Updates**: When someone creates, edits, or deletes a package, all connected users see the changes immediately
- **Notifications**: Toast notifications appear for all successful actions
- **Instant Feedback**: No page refreshes needed for updates

## 🗄️ Database Schema

### shortcut_packages
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `author` (TEXT, NOT NULL)
- `category` (TEXT)
- `shortcuts` (TEXT, JSON format)
- `downloads` (INTEGER, DEFAULT 0)
- `rating` (REAL, DEFAULT 0)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### users (for future authentication)
- `id` (INTEGER, PRIMARY KEY)
- `username` (TEXT, UNIQUE, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

## 🔧 API Endpoints

### GET /api/packages
Returns all packages ordered by creation date

### GET /api/packages/:id
Returns a specific package by ID

### POST /api/packages
Creates a new package
```json
{
  "name": "Package Name",
  "description": "Package description",
  "author": "Author Name",
  "category": "Development",
  "shortcuts": [
    {
      "key": "Ctrl+S",
      "action": "Save",
      "description": "Save the current file"
    }
  ]
}
```

### PUT /api/packages/:id
Updates an existing package

### DELETE /api/packages/:id
Deletes a package

## 🔌 Real-time Events

### Socket.io Events
- `packageAdded`: Emitted when a new package is created
- `packageUpdated`: Emitted when a package is modified
- `packageDeleted`: Emitted when a package is deleted
- `joinPackage`: Join a room for specific package updates
- `leavePackage`: Leave a package room

## 🎨 Customization

### Styling
The app uses CSS custom properties and modern CSS features. Main styles are in `client/src/index.css`.

### Adding New Features
1. **Backend**: Add new routes in `server/index.js`
2. **Frontend**: Create new components in `client/src/components/`
3. **Real-time**: Emit socket events for live updates

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# The backend will serve the built frontend from client/dist/
```

### Environment Variables
- `PORT`: Server port (default: 3000)

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

**KeyWizard.com** - Share the power of keyboard shortcuts! ⌨️✨
