require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const passport = require('./config/passport');
const { migrateDatabase } = require('./database-migration');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../client/public/images/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'package-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Serve uploaded images in both development and production
app.use('/images/uploads', express.static(path.join(__dirname, '../client/public/images/uploads')));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database setup
const db = new sqlite3.Database(process.env.DATABASE_PATH || './server/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
    // Run migration to add new packages
    migrateDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Users table with Google OAuth fields
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Shortcut packages table with author relationship
    db.run(`CREATE TABLE IF NOT EXISTS shortcut_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      author_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      category TEXT,
      shortcuts TEXT NOT NULL,
      image_url TEXT,
      downloads INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
    )`);

    // Add image_url column to existing tables if it doesn't exist
    db.run(`ALTER TABLE shortcut_packages ADD COLUMN image_url TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding image_url column:', err.message);
      }
    });

    // Update existing VS Code package with new logo
    db.run(`UPDATE shortcut_packages SET image_url = ? WHERE name LIKE '%VS Code%'`, 
      ['/images/vscode-logo.png'], 
      (err) => {
        if (err) {
          console.error('Error updating VS Code package:', err.message);
        } else {
          console.log('Updated VS Code package with new logo');
        }
      }
    );

    // Update existing packages with new logos (if they exist)
    const packageUpdates = [
      { name: 'IntelliJ IDEA Ultimate', image: '/images/intellij-logo.png' },
      { name: 'Eclipse IDE', image: '/images/eclipse-logo.png' },
      { name: 'Figma Design Pro', image: '/images/figma-logo.png' },
      { name: 'Sketch UI/UX', image: '/images/sketch-logo.png' },
      { name: 'Adobe Illustrator', image: '/images/illustrator-logo.png' },
      { name: 'Microsoft Word', image: '/images/word-logo.png' },
      { name: 'Microsoft Excel', image: '/images/excel-logo.png' },
      { name: 'Microsoft PowerPoint', image: '/images/powerpoint-logo.png' },
      { name: 'Microsoft Teams', image: '/images/teams-logo.png' },
      { name: 'Slack Workspace', image: '/images/slack-logo.png' },
      { name: 'Discord Chat', image: '/images/discord-logo.png' },
      { name: 'Gmail Inbox', image: '/images/gmail-logo.png' },
      { name: 'Microsoft Outlook', image: '/images/outlook-logo.png' },
      { name: 'Final Cut Pro X', image: '/images/finalcut-logo.png' },
      { name: 'Twitch Streaming', image: '/images/twitch-logo.png' },
      { name: 'Google Chrome', image: '/images/chrome-logo.png' },
      { name: 'Mozilla Firefox', image: '/images/firefox-logo.png' },
      { name: 'Microsoft Edge', image: '/images/edge-logo.png' }
    ];

    packageUpdates.forEach(pkg => {
      db.run(`UPDATE shortcut_packages SET image_url = ? WHERE name = ?`, 
        [pkg.image, pkg.name], 
        (err) => {
          if (err) {
            console.error(`Error updating ${pkg.name}:`, err.message);
          } else {
            console.log(`Updated ${pkg.name} with logo`);
          }
        }
      );
    });

    // Insert sample data only if no packages exist
    db.get('SELECT COUNT(*) as count FROM shortcut_packages', (err, row) => {
      if (err) {
        console.error('Error checking packages:', err.message);
        return;
      }
      
      if (row.count === 0) {
        // Create a sample user first
        db.run('INSERT OR IGNORE INTO users (google_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
          ['sample_user_1', 'KeyWizard Community', 'community@keywizard.com', null],
          function(err) {
            if (err) {
              console.error('Error creating sample user:', err.message);
              return;
            }
            
            const sampleUserId = this.lastID;
            
            // Insert sample packages
            const samplePackages = [
              // DEVELOPMENT CATEGORY
              {
                name: "VS Code Productivity",
                description: "Essential shortcuts for VS Code development",
                author_id: sampleUserId,
                author_name: "CodeMaster",
                category: "Development",
                image_url: "/images/vscode-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+Shift+P", action: "Command Palette", description: "Open command palette" },
                  { key: "Ctrl+P", action: "Quick Open", description: "Quick file navigation" },
                  { key: "Ctrl+Shift+F", action: "Find in Files", description: "Search across all files" },
                  { key: "Ctrl+/", action: "Toggle Comment", description: "Comment/uncomment line" },
                  { key: "Alt+Shift+F", action: "Format Document", description: "Format entire document" },
                  { key: "Ctrl+Space", action: "Trigger Suggestions", description: "Show IntelliSense" },
                  { key: "F12", action: "Go to Definition", description: "Navigate to function definition" },
                  { key: "Ctrl+Shift+O", action: "Go to Symbol", description: "Navigate to symbol in file" },
                  { key: "Ctrl+G", action: "Go to Line", description: "Jump to specific line number" },
                  { key: "Ctrl+Shift+M", action: "Problems Panel", description: "Show problems and errors" }
                ])
              },
              {
                name: "IntelliJ IDEA Ultimate",
                description: "Professional Java development shortcuts",
                author_id: sampleUserId,
                author_name: "DevWizard",
                category: "Development",
                image_url: "/images/intellij-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+N", action: "Go to Class", description: "Navigate to any class" },
                  { key: "Ctrl+Shift+N", action: "Go to File", description: "Navigate to any file" },
                  { key: "Ctrl+Shift+Alt+N", action: "Go to Symbol", description: "Navigate to any symbol" },
                  { key: "Ctrl+B", action: "Go to Declaration", description: "Go to method/field declaration" },
                  { key: "Ctrl+Alt+B", action: "Go to Implementation", description: "Go to implementation" },
                  { key: "Ctrl+Shift+F12", action: "Maximize Editor", description: "Toggle full screen editor" },
                  { key: "Ctrl+E", action: "Recent Files", description: "Show recently opened files" },
                  { key: "Ctrl+Shift+E", action: "Recent Locations", description: "Show recent locations" },
                  { key: "Ctrl+Shift+A", action: "Find Action", description: "Find any action or setting" },
                  { key: "Ctrl+Alt+L", action: "Reformat Code", description: "Format current file" }
                ])
              },
              {
                name: "Eclipse IDE",
                description: "Classic Java IDE keyboard shortcuts",
                author_id: sampleUserId,
                author_name: "TechGuru",
                category: "Development",
                image_url: "/images/eclipse-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+Shift+R", action: "Open Resource", description: "Open any file in workspace" },
                  { key: "Ctrl+Shift+T", action: "Open Type", description: "Open any Java type" },
                  { key: "Ctrl+1", action: "Quick Fix", description: "Show quick fixes and refactorings" },
                  { key: "Ctrl+Shift+F", action: "Format", description: "Format current file" },
                  { key: "Ctrl+Shift+O", action: "Organize Imports", description: "Organize import statements" },
                  { key: "Ctrl+Shift+G", action: "Find References", description: "Find all references to selected element" },
                  { key: "F3", action: "Open Declaration", description: "Go to declaration of selected element" },
                  { key: "Ctrl+Alt+H", action: "Open Call Hierarchy", description: "Show call hierarchy" },
                  { key: "Ctrl+Shift+P", action: "Open Package Explorer", description: "Show package explorer view" },
                  { key: "Ctrl+Shift+E", action: "Show in Explorer", description: "Show current file in explorer" }
                ])
              },

              // DESIGN CATEGORY
              {
                name: "Figma Design Pro",
                description: "Essential shortcuts for Figma design workflow",
                author_id: sampleUserId,
                author_name: "DesignMaster",
                category: "Design",
                image_url: "/images/figma-logo.png",
                shortcuts: JSON.stringify([
                  { key: "V", action: "Move Tool", description: "Select and move objects" },
                  { key: "K", action: "Scale Tool", description: "Scale and resize objects" },
                  { key: "F", action: "Frame Tool", description: "Create frames and containers" },
                  { key: "R", action: "Rectangle Tool", description: "Create rectangles and squares" },
                  { key: "O", action: "Ellipse Tool", description: "Create circles and ellipses" },
                  { key: "T", action: "Text Tool", description: "Add and edit text" },
                  { key: "P", action: "Pen Tool", description: "Create custom shapes and paths" },
                  { key: "Ctrl+D", action: "Duplicate", description: "Duplicate selected objects" },
                  { key: "Ctrl+G", action: "Group", description: "Group selected objects" },
                  { key: "Ctrl+Shift+G", action: "Ungroup", description: "Ungroup selected objects" }
                ])
              },
              {
                name: "Sketch UI/UX",
                description: "Professional UI/UX design shortcuts for Sketch",
                author_id: sampleUserId,
                author_name: "CodeMaster",
                category: "Design",
                image_url: "/images/sketch-logo.png",
                shortcuts: JSON.stringify([
                  { key: "V", action: "Vector Tool", description: "Create vector shapes" },
                  { key: "R", action: "Rectangle Tool", description: "Create rectangles" },
                  { key: "O", action: "Oval Tool", description: "Create circles and ovals" },
                  { key: "T", action: "Text Tool", description: "Add text layers" },
                  { key: "P", action: "Pencil Tool", description: "Draw freehand shapes" },
                  { key: "L", action: "Line Tool", description: "Create straight lines" },
                  { key: "A", action: "Artboard Tool", description: "Create artboards" },
                  { key: "Cmd+D", action: "Duplicate", description: "Duplicate selected layers" },
                  { key: "Cmd+G", action: "Group", description: "Group selected layers" },
                  { key: "Cmd+Shift+G", action: "Ungroup", description: "Ungroup selected layers" }
                ])
              },
              {
                name: "Adobe Illustrator",
                description: "Vector graphics and illustration shortcuts",
                author_id: sampleUserId,
                author_name: "DevWizard",
                category: "Design",
                image_url: "/images/illustrator-logo.png",
                shortcuts: JSON.stringify([
                  { key: "V", action: "Selection Tool", description: "Select and move objects" },
                  { key: "A", action: "Direct Selection Tool", description: "Select anchor points" },
                  { key: "P", action: "Pen Tool", description: "Create paths and shapes" },
                  { key: "T", action: "Type Tool", description: "Add text to artwork" },
                  { key: "M", action: "Rectangle Tool", description: "Create rectangles" },
                  { key: "L", action: "Ellipse Tool", description: "Create circles and ellipses" },
                  { key: "N", action: "Pencil Tool", description: "Draw freehand paths" },
                  { key: "Cmd+D", action: "Transform Again", description: "Repeat last transformation" },
                  { key: "Cmd+G", action: "Group", description: "Group selected objects" },
                  { key: "Cmd+Shift+G", action: "Ungroup", description: "Ungroup selected objects" }
                ])
              },

              // PRODUCTIVITY CATEGORY
              {
                name: "Microsoft Word",
                description: "Essential shortcuts for document creation",
                author_id: sampleUserId,
                author_name: "TechGuru",
                category: "Productivity",
                image_url: "/images/word-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+S", action: "Save", description: "Save current document" },
                  { key: "Ctrl+N", action: "New Document", description: "Create new document" },
                  { key: "Ctrl+O", action: "Open", description: "Open existing document" },
                  { key: "Ctrl+P", action: "Print", description: "Print document" },
                  { key: "Ctrl+Z", action: "Undo", description: "Undo last action" },
                  { key: "Ctrl+Y", action: "Redo", description: "Redo last undone action" },
                  { key: "Ctrl+B", action: "Bold", description: "Make text bold" },
                  { key: "Ctrl+I", action: "Italic", description: "Make text italic" },
                  { key: "Ctrl+U", action: "Underline", description: "Underline text" },
                  { key: "Ctrl+F", action: "Find", description: "Find text in document" }
                ])
              },
              {
                name: "Microsoft Excel",
                description: "Spreadsheet and data analysis shortcuts",
                author_id: sampleUserId,
                author_name: "DesignMaster",
                category: "Productivity",
                image_url: "/images/excel-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+C", action: "Copy", description: "Copy selected cells" },
                  { key: "Ctrl+V", action: "Paste", description: "Paste copied cells" },
                  { key: "Ctrl+X", action: "Cut", description: "Cut selected cells" },
                  { key: "Ctrl+Z", action: "Undo", description: "Undo last action" },
                  { key: "F2", action: "Edit Cell", description: "Edit active cell" },
                  { key: "Ctrl+Arrow", action: "Navigate", description: "Move to edge of data" },
                  { key: "Ctrl+Shift+Arrow", action: "Select Range", description: "Select to edge of data" },
                  { key: "Ctrl+1", action: "Format Cells", description: "Open format cells dialog" },
                  { key: "Ctrl+Shift+L", action: "Filter", description: "Toggle filter on/off" },
                  { key: "F4", action: "Repeat Action", description: "Repeat last action" }
                ])
              },
              {
                name: "Microsoft PowerPoint",
                description: "Presentation creation and editing shortcuts",
                author_id: sampleUserId,
                author_name: "CodeMaster",
                category: "Productivity",
                image_url: "/images/powerpoint-logo.png",
                shortcuts: JSON.stringify([
                  { key: "F5", action: "Start Slideshow", description: "Start presentation from beginning" },
                  { key: "Shift+F5", action: "Start from Current", description: "Start presentation from current slide" },
                  { key: "Ctrl+M", action: "New Slide", description: "Insert new slide" },
                  { key: "Ctrl+D", action: "Duplicate Slide", description: "Duplicate selected slide" },
                  { key: "Ctrl+Shift+D", action: "Duplicate Object", description: "Duplicate selected object" },
                  { key: "Ctrl+G", action: "Group", description: "Group selected objects" },
                  { key: "Ctrl+Shift+G", action: "Ungroup", description: "Ungroup selected objects" },
                  { key: "Ctrl+Shift+C", action: "Format Painter", description: "Copy formatting" },
                  { key: "Ctrl+Shift+V", action: "Paste Format", description: "Paste formatting" },
                  { key: "Ctrl+Enter", action: "New Line", description: "Insert line break in text box" }
                ])
              },
              {
                name: "Microsoft Teams",
                description: "Team collaboration and communication shortcuts",
                author_id: sampleUserId,
                author_name: "DevWizard",
                category: "Productivity",
                image_url: "/images/teams-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+E", action: "Search", description: "Search for people, files, or messages" },
                  { key: "Ctrl+1", action: "Activity", description: "Go to activity feed" },
                  { key: "Ctrl+2", action: "Chat", description: "Go to chat" },
                  { key: "Ctrl+3", action: "Teams", description: "Go to teams" },
                  { key: "Ctrl+4", action: "Calendar", description: "Go to calendar" },
                  { key: "Ctrl+5", action: "Calls", description: "Go to calls" },
                  { key: "Ctrl+6", action: "Files", description: "Go to files" },
                  { key: "Ctrl+Shift+M", action: "New Message", description: "Start new chat" },
                  { key: "Ctrl+Shift+O", action: "New Meeting", description: "Schedule new meeting" },
                  { key: "Ctrl+Shift+A", action: "Accept Call", description: "Accept incoming call" }
                ])
              },
              {
                name: "Slack Workspace",
                description: "Team messaging and collaboration shortcuts",
                author_id: sampleUserId,
                author_name: "TechGuru",
                category: "Productivity",
                image_url: "/images/slack-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+K", action: "Quick Switcher", description: "Switch between channels and DMs" },
                  { key: "Ctrl+T", action: "Jump to Recent", description: "Jump to recent conversations" },
                  { key: "Ctrl+Shift+K", action: "Browse Channels", description: "Browse all channels" },
                  { key: "Ctrl+Shift+L", action: "Browse Direct Messages", description: "Browse all DMs" },
                  { key: "Ctrl+Shift+M", action: "All Unread", description: "View all unread messages" },
                  { key: "Ctrl+Shift+A", action: "All Threads", description: "View all threads" },
                  { key: "Ctrl+Shift+S", action: "All Snippets", description: "View all snippets" },
                  { key: "Ctrl+Shift+F", action: "Search Files", description: "Search for files" },
                  { key: "Ctrl+Shift+E", action: "Search People", description: "Search for people" },
                  { key: "Ctrl+Shift+O", action: "Search Messages", description: "Search messages" }
                ])
              },

              // COMMUNICATION CATEGORY
              {
                name: "Discord Chat",
                description: "Gaming and community chat shortcuts",
                author_id: sampleUserId,
                author_name: "DesignMaster",
                category: "Communication",
                image_url: "/images/discord-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+K", action: "Quick Switcher", description: "Switch between servers and channels" },
                  { key: "Ctrl+Shift+K", action: "Browse Channels", description: "Browse all channels" },
                  { key: "Ctrl+Shift+M", action: "All Unread", description: "View all unread messages" },
                  { key: "Ctrl+Shift+A", action: "All Threads", description: "View all threads" },
                  { key: "Ctrl+Shift+S", action: "All Snippets", description: "View all snippets" },
                  { key: "Ctrl+Shift+F", action: "Search Files", description: "Search for files" },
                  { key: "Ctrl+Shift+E", action: "Search People", description: "Search for people" },
                  { key: "Ctrl+Shift+O", action: "Search Messages", description: "Search messages" },
                  { key: "Ctrl+Shift+P", action: "User Settings", description: "Open user settings" },
                  { key: "Ctrl+Shift+Q", action: "Server Settings", description: "Open server settings" }
                ])
              },
              {
                name: "Gmail Inbox",
                description: "Email management and organization shortcuts",
                author_id: sampleUserId,
                author_name: "CodeMaster",
                category: "Communication",
                image_url: "/images/gmail-logo.png",
                shortcuts: JSON.stringify([
                  { key: "C", action: "Compose", description: "Start new email" },
                  { key: "R", action: "Reply", description: "Reply to selected email" },
                  { key: "A", action: "Reply All", description: "Reply to all recipients" },
                  { key: "F", action: "Forward", description: "Forward selected email" },
                  { key: "E", action: "Archive", description: "Archive selected emails" },
                  { key: "Delete", action: "Delete", description: "Delete selected emails" },
                  { key: "M", action: "Mute", description: "Mute conversation" },
                  { key: "S", action: "Star", description: "Star/unstar email" },
                  { key: "L", action: "Label", description: "Add label to email" },
                  { key: "Shift+I", action: "Mark as Read", description: "Mark email as read" }
                ])
              },
              {
                name: "Microsoft Outlook",
                description: "Professional email and calendar management",
                author_id: sampleUserId,
                author_name: "DevWizard",
                category: "Communication",
                image_url: "/images/outlook-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+N", action: "New Email", description: "Create new email" },
                  { key: "Ctrl+R", action: "Reply", description: "Reply to selected email" },
                  { key: "Ctrl+Shift+R", action: "Reply All", description: "Reply to all recipients" },
                  { key: "Ctrl+F", action: "Forward", description: "Forward selected email" },
                  { key: "Ctrl+Enter", action: "Send", description: "Send email" },
                  { key: "Delete", action: "Delete", description: "Delete selected item" },
                  { key: "Ctrl+Shift+A", action: "New Appointment", description: "Create new calendar appointment" },
                  { key: "Ctrl+Shift+L", action: "New Contact", description: "Create new contact" },
                  { key: "Ctrl+Shift+E", action: "New Task", description: "Create new task" },
                  { key: "Ctrl+Shift+J", action: "New Journal Entry", description: "Create new journal entry" }
                ])
              },

              // MEDIA CATEGORY
              {
                name: "Final Cut Pro X",
                description: "Professional video editing shortcuts",
                author_id: sampleUserId,
                author_name: "TechGuru",
                category: "Media",
                image_url: "/images/finalcut-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Space", action: "Play/Pause", description: "Play or pause playback" },
                  { key: "J", action: "Reverse Playback", description: "Play backwards" },
                  { key: "K", action: "Stop", description: "Stop playback" },
                  { key: "L", action: "Forward Playback", description: "Play forwards" },
                  { key: "I", action: "Set In Point", description: "Set in point at playhead" },
                  { key: "O", action: "Set Out Point", description: "Set out point at playhead" },
                  { key: "X", action: "Select Clip", description: "Select clip at playhead" },
                  { key: "A", action: "Select Tool", description: "Switch to select tool" },
                  { key: "B", action: "Blade Tool", description: "Switch to blade tool" },
                  { key: "Z", action: "Zoom Tool", description: "Switch to zoom tool" }
                ])
              },
              {
                name: "Twitch Streaming",
                description: "Live streaming and chat management shortcuts",
                author_id: sampleUserId,
                author_name: "DesignMaster",
                category: "Media",
                image_url: "/images/twitch-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+Shift+S", action: "Start Stream", description: "Start broadcasting" },
                  { key: "Ctrl+Shift+E", action: "End Stream", description: "End broadcasting" },
                  { key: "Ctrl+Shift+C", action: "Toggle Chat", description: "Show/hide chat panel" },
                  { key: "Ctrl+Shift+A", action: "Toggle Alerts", description: "Show/hide alerts panel" },
                  { key: "Ctrl+Shift+D", action: "Toggle Dashboard", description: "Show/hide dashboard" },
                  { key: "Ctrl+Shift+M", action: "Mute Mic", description: "Mute/unmute microphone" },
                  { key: "Ctrl+Shift+V", action: "Mute Video", description: "Mute/unmute video" },
                  { key: "Ctrl+Shift+B", action: "Toggle Browser Source", description: "Show/hide browser sources" },
                  { key: "Ctrl+Shift+O", action: "Toggle Overlay", description: "Show/hide overlays" },
                  { key: "Ctrl+Shift+P", action: "Push to Talk", description: "Hold to talk" }
                ])
              },

              // WEB CATEGORY
              {
                name: "Google Chrome",
                description: "Web browsing and navigation shortcuts",
                author_id: sampleUserId,
                author_name: "CodeMaster",
                category: "Web",
                image_url: "/images/chrome-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+T", action: "New Tab", description: "Open new tab" },
                  { key: "Ctrl+W", action: "Close Tab", description: "Close current tab" },
                  { key: "Ctrl+Shift+T", action: "Reopen Tab", description: "Reopen last closed tab" },
                  { key: "Ctrl+Tab", action: "Next Tab", description: "Switch to next tab" },
                  { key: "Ctrl+Shift+Tab", action: "Previous Tab", description: "Switch to previous tab" },
                  { key: "Ctrl+L", action: "Address Bar", description: "Focus address bar" },
                  { key: "Ctrl+R", action: "Reload", description: "Reload current page" },
                  { key: "Ctrl+Shift+R", action: "Hard Reload", description: "Reload ignoring cache" },
                  { key: "Ctrl+F", action: "Find", description: "Find text on page" },
                  { key: "Ctrl+D", action: "Bookmark", description: "Bookmark current page" }
                ])
              },
              {
                name: "Mozilla Firefox",
                description: "Privacy-focused browsing shortcuts",
                author_id: sampleUserId,
                author_name: "DevWizard",
                category: "Web",
                image_url: "/images/firefox-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+T", action: "New Tab", description: "Open new tab" },
                  { key: "Ctrl+W", action: "Close Tab", description: "Close current tab" },
                  { key: "Ctrl+Shift+T", action: "Reopen Tab", description: "Reopen last closed tab" },
                  { key: "Ctrl+Tab", action: "Next Tab", description: "Switch to next tab" },
                  { key: "Ctrl+Shift+Tab", action: "Previous Tab", description: "Switch to previous tab" },
                  { key: "Ctrl+L", action: "Address Bar", description: "Focus address bar" },
                  { key: "Ctrl+R", action: "Reload", description: "Reload current page" },
                  { key: "Ctrl+Shift+R", action: "Hard Reload", description: "Reload ignoring cache" },
                  { key: "Ctrl+F", action: "Find", description: "Find text on page" },
                  { key: "Ctrl+D", action: "Bookmark", description: "Bookmark current page" }
                ])
              },
              {
                name: "Microsoft Edge",
                description: "Modern web browsing with Microsoft integration",
                author_id: sampleUserId,
                author_name: "TechGuru",
                category: "Web",
                image_url: "/images/edge-logo.png",
                shortcuts: JSON.stringify([
                  { key: "Ctrl+T", action: "New Tab", description: "Open new tab" },
                  { key: "Ctrl+W", action: "Close Tab", description: "Close current tab" },
                  { key: "Ctrl+Shift+T", action: "Reopen Tab", description: "Reopen last closed tab" },
                  { key: "Ctrl+Tab", action: "Next Tab", description: "Switch to next tab" },
                  { key: "Ctrl+Shift+Tab", action: "Previous Tab", description: "Switch to previous tab" },
                  { key: "Ctrl+L", action: "Address Bar", description: "Focus address bar" },
                  { key: "Ctrl+R", action: "Reload", description: "Reload current page" },
                  { key: "Ctrl+Shift+R", action: "Hard Reload", description: "Reload ignoring cache" },
                  { key: "Ctrl+F", action: "Find", description: "Find text on page" },
                  { key: "Ctrl+D", action: "Bookmark", description: "Bookmark current page" }
                ])
              }
            ];

            const insertStmt = db.prepare(`INSERT INTO shortcut_packages 
              (name, description, author_id, author_name, category, image_url, shortcuts) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            
            samplePackages.forEach(pkg => {
              insertStmt.run(pkg.name, pkg.description, pkg.author_id, pkg.author_name, pkg.category, pkg.image_url, pkg.shortcuts);
            });
            insertStmt.finalize();
          }
        );
      }
    });
  });
}

// Import routes
const authRoutes = require('./routes/auth');
const { requireAuth, optionalAuth, checkPackageOwnership } = require('./middleware/auth');

// Routes
app.use('/api/auth', authRoutes);

// API Routes with authentication
app.get('/api/packages', optionalAuth, (req, res) => {
  db.all('SELECT p.*, u.username as author_username, u.avatar_url as author_avatar FROM shortcut_packages p LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/packages/:id', optionalAuth, (req, res) => {
  db.get('SELECT p.*, u.username as author_username, u.avatar_url as author_avatar FROM shortcut_packages p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/packages', requireAuth, (req, res) => {
  const { name, description, category, shortcuts, image_url } = req.body;
  
  if (!name || !shortcuts) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const shortcutsJson = JSON.stringify(shortcuts);
  
  db.run(
    'INSERT INTO shortcut_packages (name, description, author_id, author_name, category, image_url, shortcuts) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, req.user.id, req.user.username, category, image_url || null, shortcutsJson],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the newly created package
      db.get('SELECT p.*, u.username as author_username, u.avatar_url as author_avatar FROM shortcut_packages p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Emit real-time update to all connected clients
        io.emit('packageAdded', row);
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/packages/:id', requireAuth, checkPackageOwnership, (req, res) => {
  const { name, description, category, shortcuts, image_url } = req.body;
  const shortcutsJson = JSON.stringify(shortcuts);
  
  db.run(
    'UPDATE shortcut_packages SET name = ?, description = ?, category = ?, image_url = ?, shortcuts = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, category, image_url || null, shortcutsJson, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }
      
      // Get the updated package
      db.get('SELECT p.*, u.username as author_username, u.avatar_url as author_avatar FROM shortcut_packages p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?', [req.params.id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Emit real-time update
        io.emit('packageUpdated', row);
        res.json(row);
      });
    }
  );
});

app.delete('/api/packages/:id', requireAuth, checkPackageOwnership, (req, res) => {
  db.run('DELETE FROM shortcut_packages WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    
    // Emit real-time update
    io.emit('packageDeleted', { id: parseInt(req.params.id) });
    res.json({ message: 'Package deleted successfully' });
  });
});

// Image upload endpoint
app.post('/api/upload-image', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Return the path to the uploaded image
    const imagePath = `/images/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imagePath: imagePath,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Error handling for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed!' });
  }
  next(error);
});

// Socket.io connection handling with authentication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Join a room for specific package updates
  socket.on('joinPackage', (packageId) => {
    socket.join(`package_${packageId}`);
  });
  
  // Leave a package room
  socket.on('leavePackage', (packageId) => {
    socket.leave(`package_${packageId}`);
  });
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // In development, redirect to the Vite dev server
  app.get('*', (req, res) => {
    res.redirect('http://localhost:5173' + req.url);
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Real-time updates enabled via Socket.io`);
  console.log(`Google OAuth authentication enabled`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Development mode: Frontend served by Vite on port 5173`);
  }
}); 