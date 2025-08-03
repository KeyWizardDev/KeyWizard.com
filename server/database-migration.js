const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function migrateDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);

  // Enable WAL mode for better concurrency
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA cache_size = 10000');
  db.run('PRAGMA temp_store = memory');

  console.log('Running database migration...');

  // First, get the sample user ID
  db.get('SELECT id FROM users WHERE google_id = ?', ['sample_user_1'], (err, user) => {
    if (err) {
      console.error('Error getting sample user:', err.message);
      db.close();
      return;
    }

    if (!user) {
      console.log('Sample user not found, creating...');
      db.run('INSERT INTO users (google_id, username, email, avatar_url) VALUES (?, ?, ?, ?)',
        ['sample_user_1', 'KeyWizard Community', 'community@keywizard.com', null],
        function(err) {
          if (err) {
            console.error('Error creating sample user:', err.message);
            db.close();
            return;
          }
          console.log('Sample user created with ID:', this.lastID);
          addPackages(this.lastID);
        }
      );
    } else {
      console.log('Sample user found with ID:', user.id);
      addPackages(user.id);
    }
  });

  function addPackages(sampleUserId) {
    const packages = [
      {
        name: "Adobe Illustrator",
        description: "Vector graphics and illustration shortcuts",
        author_id: sampleUserId,
        author_name: "DevWizard",
        category: "Design",
        image_url: "/images/illustrator-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "V",
                    "action": "Selection Tool",
                    "description": "Select and move objects"
          },
          {
                    "key": "A",
                    "action": "Direct Selection Tool",
                    "description": "Select anchor points"
          },
          {
                    "key": "P",
                    "action": "Pen Tool",
                    "description": "Create paths and shapes"
          },
          {
                    "key": "T",
                    "action": "Type Tool",
                    "description": "Add text to artwork"
          },
          {
                    "key": "M",
                    "action": "Rectangle Tool",
                    "description": "Create rectangles"
          },
          {
                    "key": "L",
                    "action": "Ellipse Tool",
                    "description": "Create circles and ellipses"
          },
          {
                    "key": "N",
                    "action": "Pencil Tool",
                    "description": "Draw freehand paths"
          },
          {
                    "key": "Cmd+D",
                    "action": "Transform Again",
                    "description": "Repeat last transformation"
          },
          {
                    "key": "Cmd+G",
                    "action": "Group",
                    "description": "Group selected objects"
          },
          {
                    "key": "Cmd+Shift+G",
                    "action": "Ungroup",
                    "description": "Ungroup selected objects"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Create Outlines",
                    "description": "Convert text to outlines"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Expand",
                    "description": "Expand objects and effects"
          },
          {
                    "key": "Cmd+Shift+M",
                    "action": "Make Mask",
                    "description": "Create clipping mask"
          },
          {
                    "key": "Cmd+7",
                    "action": "Make Clipping Mask",
                    "description": "Create clipping mask"
          },
          {
                    "key": "Cmd+Shift+7",
                    "action": "Release Clipping Mask",
                    "description": "Release clipping mask"
          },
          {
                    "key": "Cmd+Shift+F",
                    "action": "Bring to Front",
                    "description": "Bring object to front"
          },
          {
                    "key": "Cmd+Shift+B",
                    "action": "Send to Back",
                    "description": "Send object to back"
          },
          {
                    "key": "Cmd+Shift+]",
                    "action": "Bring Forward",
                    "description": "Bring object forward"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Send Backward",
                    "description": "Send object backward"
          },
          {
                    "key": "Cmd+Shift+U",
                    "action": "Unite",
                    "description": "Combine shapes with union"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Subtract",
                    "description": "Subtract shapes"
          },
          {
                    "key": "Cmd+Shift+X",
                    "action": "Intersect",
                    "description": "Intersect shapes"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Exclude",
                    "description": "Exclude overlapping areas"
          },
          {
                    "key": "Cmd+Shift+D",
                    "action": "Divide",
                    "description": "Divide objects"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Outline Stroke",
                    "description": "Convert stroke to outline"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Expand Appearance",
                    "description": "Expand appearance effects"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Offset Path",
                    "description": "Create offset path"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Simplify",
                    "description": "Simplify paths"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Add Anchor Points",
                    "description": "Add anchor points"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Remove Anchor Points",
                    "description": "Remove anchor points"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Average",
                    "description": "Average anchor points"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Join",
                    "description": "Join anchor points"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Outline Object",
                    "description": "Create outline object"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Envelope Distort",
                    "description": "Apply envelope distort"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Make with Warp",
                    "description": "Create warp effect"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Make with Mesh",
                    "description": "Create mesh effect"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Make with Top Object",
                    "description": "Create top object effect"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Reset to Bounding Box",
                    "description": "Reset to bounding box"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Reset to Center",
                    "description": "Reset to center"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Reset to Origin",
                    "description": "Reset to origin"
          }
])
      },
      {
        name: "Discord Chat",
        description: "Gaming and community chat shortcuts",
        author_id: sampleUserId,
        author_name: "DesignMaster",
        category: "Communication",
        image_url: "/images/discord-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "Ctrl+K",
                    "action": "Quick Switcher",
                    "description": "Switch between channels and DMs"
          },
          {
                    "key": "Ctrl+T",
                    "action": "Jump to Recent",
                    "description": "Jump to recent conversations"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Browse Channels",
                    "description": "Browse all channels"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Browse Direct Messages",
                    "description": "Browse all DMs"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "All Unread",
                    "description": "View all unread messages"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Threads",
                    "description": "View all threads"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "All Snippets",
                    "description": "View all snippets"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Search Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Search People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Search Messages",
                    "description": "Search messages"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Preferences",
                    "description": "Open preferences"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "User Settings",
                    "description": "Open user settings"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Server Settings",
                    "description": "Open server settings"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Message",
                    "description": "Start new message"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "New DM",
                    "description": "Start new direct message"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "New Group DM",
                    "description": "Start new group DM"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "History",
                    "description": "View message history"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Jump to Date",
                    "description": "Jump to specific date"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bookmarks",
                    "description": "View bookmarks"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "View Profile",
                    "description": "View user profile"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Edit Profile",
                    "description": "Edit your profile"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Status",
                    "description": "Set your status"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Discord"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Discord"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Toggle Theme",
                    "description": "Switch between light/dark theme"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Toggle Sidebar",
                    "description": "Show/hide sidebar"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Toggle Emoji",
                    "description": "Show/hide emoji picker"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Toggle Mentions",
                    "description": "Show/hide mentions"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Toggle Pinned",
                    "description": "Show/hide pinned items"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Toggle Starred",
                    "description": "Show/hide starred items"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Toggle Apps",
                    "description": "Show/hide apps"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Toggle Help",
                    "description": "Show/hide help"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mute/Unmute",
                    "description": "Toggle microphone"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Turn Camera On/Off",
                    "description": "Toggle camera"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Share Screen",
                    "description": "Share your screen"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Raise Hand",
                    "description": "Raise hand in call"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Background Blur",
                    "description": "Toggle background blur"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Server",
                    "description": "Create new server"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Find People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Discord"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Discord"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in Discord"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save",
                    "description": "Save current item"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current item"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          }
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
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Open Resource",
                    "description": "Open any file in workspace"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Open Type",
                    "description": "Open any Java type"
          },
          {
                    "key": "Ctrl+1",
                    "action": "Quick Fix",
                    "description": "Show quick fixes and refactorings"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Format",
                    "description": "Format current file"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Organize Imports",
                    "description": "Organize import statements"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Find References",
                    "description": "Find all references to selected element"
          },
          {
                    "key": "F3",
                    "action": "Open Declaration",
                    "description": "Go to declaration of selected element"
          },
          {
                    "key": "Ctrl+Alt+H",
                    "action": "Open Call Hierarchy",
                    "description": "Show call hierarchy"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Open Package Explorer",
                    "description": "Show package explorer view"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Show in Explorer",
                    "description": "Show current file in explorer"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Add Import",
                    "description": "Add import for selected type"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Toggle Comment",
                    "description": "Comment/uncomment selected lines"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "To Upper Case",
                    "description": "Convert selected text to uppercase"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "To Lower Case",
                    "description": "Convert selected text to lowercase"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save All",
                    "description": "Save all modified files"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Toggle Breakpoint",
                    "description": "Toggle breakpoint at current line"
          },
          {
                    "key": "F5",
                    "action": "Step Into",
                    "description": "Step into method call"
          },
          {
                    "key": "F6",
                    "action": "Step Over",
                    "description": "Step over current line"
          },
          {
                    "key": "F7",
                    "action": "Step Return",
                    "description": "Step out of current method"
          },
          {
                    "key": "F8",
                    "action": "Resume",
                    "description": "Resume program execution"
          },
          {
                    "key": "Ctrl+F11",
                    "action": "Run",
                    "description": "Run current application"
          },
          {
                    "key": "F11",
                    "action": "Debug",
                    "description": "Debug current application"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Run Last Launched",
                    "description": "Run last launched application"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Debug Last Launched",
                    "description": "Debug last launched application"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Display",
                    "description": "Display selected expression"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Inspect",
                    "description": "Inspect selected expression"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Variables",
                    "description": "Show variables view"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Breakpoints",
                    "description": "Show breakpoints view"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Expressions",
                    "description": "Show expressions view"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Outline",
                    "description": "Show outline view"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hierarchy",
                    "description": "Show hierarchy view"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Tasks",
                    "description": "Show tasks view"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Problems",
                    "description": "Show problems view"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Java",
                    "description": "Show Java perspective"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Resource",
                    "description": "Show resource perspective"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Debug",
                    "description": "Show debug perspective"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Java Browsing",
                    "description": "Show Java browsing perspective"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Web",
                    "description": "Show web perspective"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "XML",
                    "description": "Show XML perspective"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Team",
                    "description": "Show team perspective"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "CVS Repository",
                    "description": "Show CVS repository perspective"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Ant",
                    "description": "Show Ant perspective"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Server",
                    "description": "Show server perspective"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Git",
                    "description": "Show Git perspective"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Show help perspective"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Install/Update",
                    "description": "Show install/update perspective"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Java EE",
                    "description": "Show Java EE perspective"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Java Type Hierarchy",
                    "description": "Show Java type hierarchy perspective"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Plug-in Development",
                    "description": "Show plug-in development perspective"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mylyn",
                    "description": "Show Mylyn perspective"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Remote Systems",
                    "description": "Show remote systems perspective"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Data",
                    "description": "Show data perspective"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Profiling and Logging",
                    "description": "Show profiling and logging perspective"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Test",
                    "description": "Show test perspective"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reporting",
                    "description": "Show reporting perspective"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Spring",
                    "description": "Show Spring perspective"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Team Synchronizing",
                    "description": "Show team synchronizing perspective"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "User Assistance",
                    "description": "Show user assistance perspective"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "CVS",
                    "description": "Show CVS perspective"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Web Services",
                    "description": "Show web services perspective"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "XML",
                    "description": "Show XML perspective"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "YAML",
                    "description": "Show YAML perspective"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Zest",
                    "description": "Show Zest perspective"
          }
])
      },
      {
        name: "Figma Design Pro",
        description: "Essential shortcuts for Figma design workflow",
        author_id: sampleUserId,
        author_name: "DesignMaster",
        category: "Design",
        image_url: "/images/figma-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "V",
                    "action": "Move Tool",
                    "description": "Select and move objects"
          },
          {
                    "key": "K",
                    "action": "Scale Tool",
                    "description": "Scale and resize objects"
          },
          {
                    "key": "F",
                    "action": "Frame Tool",
                    "description": "Create frames and containers"
          },
          {
                    "key": "R",
                    "action": "Rectangle Tool",
                    "description": "Create rectangles and squares"
          },
          {
                    "key": "O",
                    "action": "Ellipse Tool",
                    "description": "Create circles and ellipses"
          },
          {
                    "key": "T",
                    "action": "Text Tool",
                    "description": "Add and edit text"
          },
          {
                    "key": "P",
                    "action": "Pen Tool",
                    "description": "Create custom shapes and paths"
          },
          {
                    "key": "Ctrl+D",
                    "action": "Duplicate",
                    "description": "Duplicate selected objects"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Group",
                    "description": "Group selected objects"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Ungroup",
                    "description": "Ungroup selected objects"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Flatten",
                    "description": "Flatten selected objects"
          },
          {
                    "key": "Ctrl+Alt+K",
                    "action": "Outline Stroke",
                    "description": "Convert stroke to outline"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Create Outline",
                    "description": "Convert text to outline"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Union",
                    "description": "Combine shapes with union"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Subtract",
                    "description": "Subtract shapes"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Intersect",
                    "description": "Intersect shapes"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Exclude",
                    "description": "Exclude overlapping areas"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Select All",
                    "description": "Select all objects"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Deselect All",
                    "description": "Deselect all objects"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Select Same",
                    "description": "Select objects with same properties"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Select Inverse",
                    "description": "Invert selection"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Bring to Front",
                    "description": "Bring object to front"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Send to Back",
                    "description": "Send object to back"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Bring Forward",
                    "description": "Bring object forward"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Send Backward",
                    "description": "Send object backward"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mask",
                    "description": "Create mask from selection"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Use as Mask",
                    "description": "Use selection as mask"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paste Over Selection",
                    "description": "Paste over selected object"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste in Place",
                    "description": "Paste in original position"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Properties",
                    "description": "Copy object properties"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Paste Properties",
                    "description": "Paste object properties"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Create Component",
                    "description": "Create component from selection"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Detach Instance",
                    "description": "Detach component instance"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reset Instance",
                    "description": "Reset component instance"
          }
])
      },
      {
        name: "Final Cut Pro X",
        description: "Professional video editing shortcuts",
        author_id: sampleUserId,
        author_name: "TechGuru",
        category: "Media",
        image_url: "/images/finalcut-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "Cmd+N",
                    "action": "New Project",
                    "description": "Create new project"
          },
          {
                    "key": "Cmd+O",
                    "action": "Open Project",
                    "description": "Open existing project"
          },
          {
                    "key": "Cmd+S",
                    "action": "Save",
                    "description": "Save current project"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Save As",
                    "description": "Save project with new name"
          },
          {
                    "key": "Cmd+P",
                    "action": "Print",
                    "description": "Print project"
          },
          {
                    "key": "Cmd+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Cmd+Shift+Z",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Cmd+X",
                    "action": "Cut",
                    "description": "Cut selected clip"
          },
          {
                    "key": "Cmd+C",
                    "action": "Copy",
                    "description": "Copy selected clip"
          },
          {
                    "key": "Cmd+V",
                    "action": "Paste",
                    "description": "Paste clip"
          },
          {
                    "key": "Cmd+A",
                    "action": "Select All",
                    "description": "Select all clips"
          },
          {
                    "key": "Cmd+F",
                    "action": "Find",
                    "description": "Find clip in project"
          },
          {
                    "key": "Cmd+H",
                    "action": "Replace",
                    "description": "Find and replace clip"
          },
          {
                    "key": "Cmd+G",
                    "action": "Go To",
                    "description": "Go to specific time"
          },
          {
                    "key": "Cmd+B",
                    "action": "Blade Tool",
                    "description": "Cut clip at playhead"
          },
          {
                    "key": "Cmd+I",
                    "action": "Import",
                    "description": "Import media files"
          },
          {
                    "key": "Cmd+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Cmd+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Cmd+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Cmd+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Cmd+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Cmd+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Cmd+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Cmd+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Cmd+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Cmd+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Cmd+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Cmd+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Cmd+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Cmd+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Cmd+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Cmd+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Cmd+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Cmd+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Cmd+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Cmd+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Cmd+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Cmd+Shift+Enter",
                    "action": "Page Break",
                    "description": "Insert page break"
          },
          {
                    "key": "Cmd+Enter",
                    "action": "Line Break",
                    "description": "Insert line break"
          },
          {
                    "key": "Cmd+Shift+Enter",
                    "action": "Section Break",
                    "description": "Insert section break"
          },
          {
                    "key": "Cmd+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Cmd+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Cmd+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Cmd+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Cmd+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Cmd+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Cmd+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps formatting"
          },
          {
                    "key": "Cmd+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Cmd+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Cmd+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Cmd+Shift+D",
                    "action": "Double Underline",
                    "description": "Double underline text"
          },
          {
                    "key": "Cmd+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Cmd+=",
                    "action": "Subscript",
                    "description": "Apply subscript"
          },
          {
                    "key": "Cmd+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Cmd+Shift+F2",
                    "action": "Copy Text",
                    "description": "Copy selected text to spike"
          },
          {
                    "key": "Cmd+F3",
                    "action": "Cut to Spike",
                    "description": "Cut selected text to spike"
          },
          {
                    "key": "Cmd+Shift+F3",
                    "action": "Paste Spike",
                    "description": "Paste spike contents"
          },
          {
                    "key": "Cmd+Shift+F5",
                    "action": "Bookmark",
                    "description": "Insert bookmark"
          },
          {
                    "key": "Cmd+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields in project"
          },
          {
                    "key": "Cmd+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection mode"
          },
          {
                    "key": "Cmd+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Cmd+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Cmd+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Cmd+Shift+Home",
                    "action": "Select to Start",
                    "description": "Select from cursor to start"
          },
          {
                    "key": "Cmd+Shift+End",
                    "action": "Select to End",
                    "description": "Select from cursor to end"
          },
          {
                    "key": "Cmd+Shift+Up",
                    "action": "Select Up",
                    "description": "Select text upward"
          },
          {
                    "key": "Cmd+Shift+Down",
                    "action": "Select Down",
                    "description": "Select text downward"
          },
          {
                    "key": "Cmd+Shift+Left",
                    "action": "Select Word Left",
                    "description": "Select word to left"
          },
          {
                    "key": "Cmd+Shift+Right",
                    "action": "Select Word Right",
                    "description": "Select word to right"
          },
          {
                    "key": "Cmd+Shift+Page Up",
                    "action": "Select Page Up",
                    "description": "Select text up one page"
          },
          {
                    "key": "Cmd+Shift+Page Down",
                    "action": "Select Page Down",
                    "description": "Select text down one page"
          },
          {
                    "key": "Cmd+Shift+Backspace",
                    "action": "Delete Word Left",
                    "description": "Delete word to left"
          },
          {
                    "key": "Cmd+Shift+Delete",
                    "action": "Delete Word Right",
                    "description": "Delete word to right"
          },
          {
                    "key": "Cmd+Shift+Insert",
                    "action": "Paste Special",
                    "description": "Open paste special dialog"
          },
          {
                    "key": "Cmd+Shift+F6",
                    "action": "Previous Window",
                    "description": "Switch to previous window"
          },
          {
                    "key": "Cmd+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields"
          },
          {
                    "key": "Cmd+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection"
          },
          {
                    "key": "Cmd+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Cmd+Shift+F10",
                    "action": "Maximize Window",
                    "description": "Maximize project window"
          },
          {
                    "key": "Cmd+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Cmd+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Cmd+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Cmd+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Cmd+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Cmd+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Cmd+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Cmd+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Cmd+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Cmd+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Cmd+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Cmd+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Cmd+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Cmd+Shift+B",
                    "action": "Bold",
                    "description": "Apply bold formatting"
          },
          {
                    "key": "Cmd+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Cmd+Shift+D",
                    "action": "Double Underline",
                    "description": "Apply double underline"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Cmd+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Cmd+Shift+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Cmd+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Cmd+Shift+I",
                    "action": "Italic",
                    "description": "Apply italic formatting"
          },
          {
                    "key": "Cmd+Shift+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Cmd+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps"
          },
          {
                    "key": "Cmd+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Cmd+Shift+M",
                    "action": "Reduce Indent",
                    "description": "Reduce paragraph indent"
          },
          {
                    "key": "Cmd+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Cmd+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Cmd+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Cmd+Shift+R",
                    "action": "Right Align",
                    "description": "Right align text"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Cmd+Shift+T",
                    "action": "Hanging Indent",
                    "description": "Create hanging indent"
          },
          {
                    "key": "Cmd+Shift+U",
                    "action": "Underline",
                    "description": "Apply underline"
          },
          {
                    "key": "Cmd+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Cmd+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Cmd+Shift+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Cmd+Shift+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Cmd+Shift+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Cmd+Shift+]",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Cmd+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Cmd+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Cmd+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Cmd+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Cmd+Shift+-",
                    "action": "Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Cmd+Shift+_",
                    "action": "Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Cmd+Shift+{",
                    "action": "Previous Field",
                    "description": "Go to previous field"
          },
          {
                    "key": "Cmd+Shift+}",
                    "action": "Next Field",
                    "description": "Go to next field"
          },
          {
                    "key": "Cmd+Shift+|",
                    "action": "Split Table",
                    "description": "Split table at cursor"
          },
          {
                    "key": "Cmd+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Cmd+Shift+!",
                    "action": "Insert Footnote",
                    "description": "Insert footnote"
          },
          {
                    "key": "Cmd+Shift+@",
                    "action": "Insert Endnote",
                    "description": "Insert endnote"
          },
          {
                    "key": "Cmd+Shift+#",
                    "action": "Insert Symbol",
                    "description": "Insert symbol"
          },
          {
                    "key": "Cmd+Shift+$",
                    "action": "Insert Field",
                    "description": "Insert field"
          },
          {
                    "key": "Cmd+Shift+%",
                    "action": "Insert Page Number",
                    "description": "Insert page number"
          },
          {
                    "key": "Cmd+Shift+^",
                    "action": "Insert Date and Time",
                    "description": "Insert date and time"
          },
          {
                    "key": "Cmd+Shift+&",
                    "action": "Insert AutoText",
                    "description": "Insert AutoText entry"
          },
          {
                    "key": "Cmd+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Cmd+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Cmd+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Cmd+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Cmd+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Cmd+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Cmd+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Cmd+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Cmd+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Cmd+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Cmd+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Cmd+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Cmd+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Cmd+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Cmd+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Cmd+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Cmd+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Cmd+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Cmd+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Cmd+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Cmd+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Cmd+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Cmd+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Cmd+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Cmd+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Cmd+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Cmd+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Cmd+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Cmd+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Cmd+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Cmd+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Cmd+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Cmd+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Cmd+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Cmd+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Cmd+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Cmd+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Cmd+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Cmd+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Cmd+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Cmd+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Cmd+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Cmd+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Cmd+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Cmd+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Cmd+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
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
          {
                    "key": "C",
                    "action": "Compose",
                    "description": "Start new email"
          },
          {
                    "key": "R",
                    "action": "Reply",
                    "description": "Reply to selected email"
          },
          {
                    "key": "A",
                    "action": "Reply All",
                    "description": "Reply to all recipients"
          },
          {
                    "key": "F",
                    "action": "Forward",
                    "description": "Forward selected email"
          },
          {
                    "key": "E",
                    "action": "Archive",
                    "description": "Archive selected emails"
          },
          {
                    "key": "Delete",
                    "action": "Delete",
                    "description": "Delete selected emails"
          },
          {
                    "key": "M",
                    "action": "Mute",
                    "description": "Mute conversation"
          },
          {
                    "key": "S",
                    "action": "Star",
                    "description": "Star/unstar email"
          },
          {
                    "key": "L",
                    "action": "Label",
                    "description": "Add label to email"
          },
          {
                    "key": "Shift+I",
                    "action": "Mark as Read",
                    "description": "Mark email as read"
          },
          {
                    "key": "Shift+U",
                    "action": "Mark as Unread",
                    "description": "Mark email as unread"
          },
          {
                    "key": "Shift+S",
                    "action": "Mark as Spam",
                    "description": "Mark email as spam"
          },
          {
                    "key": "Shift+N",
                    "action": "Mark as Not Spam",
                    "description": "Mark email as not spam"
          },
          {
                    "key": "Shift+T",
                    "action": "Mark as Important",
                    "description": "Mark email as important"
          },
          {
                    "key": "Shift+O",
                    "action": "Mark as Not Important",
                    "description": "Mark email as not important"
          },
          {
                    "key": "Shift+E",
                    "action": "Mark as Done",
                    "description": "Mark email as done"
          },
          {
                    "key": "Shift+D",
                    "action": "Mark as Not Done",
                    "description": "Mark email as not done"
          },
          {
                    "key": "Shift+P",
                    "action": "Mark as Pending",
                    "description": "Mark email as pending"
          },
          {
                    "key": "Shift+C",
                    "action": "Mark as Complete",
                    "description": "Mark email as complete"
          },
          {
                    "key": "Shift+V",
                    "action": "Mark as Verified",
                    "description": "Mark email as verified"
          },
          {
                    "key": "Shift+B",
                    "action": "Mark as Blocked",
                    "description": "Mark email as blocked"
          },
          {
                    "key": "Shift+W",
                    "action": "Mark as Watched",
                    "description": "Mark email as watched"
          },
          {
                    "key": "Shift+X",
                    "action": "Mark as Excluded",
                    "description": "Mark email as excluded"
          },
          {
                    "key": "Shift+Y",
                    "action": "Mark as Yes",
                    "description": "Mark email as yes"
          },
          {
                    "key": "Shift+Z",
                    "action": "Mark as No",
                    "description": "Mark email as no"
          },
          {
                    "key": "Shift+1",
                    "action": "Mark as Priority 1",
                    "description": "Mark email as priority 1"
          },
          {
                    "key": "Shift+2",
                    "action": "Mark as Priority 2",
                    "description": "Mark email as priority 2"
          },
          {
                    "key": "Shift+3",
                    "action": "Mark as Priority 3",
                    "description": "Mark email as priority 3"
          },
          {
                    "key": "Shift+4",
                    "action": "Mark as Priority 4",
                    "description": "Mark email as priority 4"
          },
          {
                    "key": "Shift+5",
                    "action": "Mark as Priority 5",
                    "description": "Mark email as priority 5"
          },
          {
                    "key": "Shift+6",
                    "action": "Mark as Priority 6",
                    "description": "Mark email as priority 6"
          },
          {
                    "key": "Shift+7",
                    "action": "Mark as Priority 7",
                    "description": "Mark email as priority 7"
          },
          {
                    "key": "Shift+8",
                    "action": "Mark as Priority 8",
                    "description": "Mark email as priority 8"
          },
          {
                    "key": "Shift+9",
                    "action": "Mark as Priority 9",
                    "description": "Mark email as priority 9"
          },
          {
                    "key": "Shift+0",
                    "action": "Mark as Priority 0",
                    "description": "Mark email as priority 0"
          }
])
      },
      {
        name: "Google Chrome",
        description: "Web browsing and navigation shortcuts",
        author_id: sampleUserId,
        author_name: "CodeMaster",
        category: "Web",
        image_url: "/images/chrome-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "Ctrl+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+W",
                    "action": "Close Tab",
                    "description": "Close current tab"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Reopen Tab",
                    "description": "Reopen last closed tab"
          },
          {
                    "key": "Ctrl+Tab",
                    "action": "Next Tab",
                    "description": "Switch to next tab"
          },
          {
                    "key": "Ctrl+Shift+Tab",
                    "action": "Previous Tab",
                    "description": "Switch to previous tab"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Address Bar",
                    "description": "Focus address bar"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Reload",
                    "description": "Reload current page"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Hard Reload",
                    "description": "Reload ignoring cache"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text on page"
          },
          {
                    "key": "Ctrl+D",
                    "action": "Bookmark",
                    "description": "Bookmark current page"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Bookmark All",
                    "description": "Bookmark all open tabs"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Bookmarks Manager",
                    "description": "Open bookmarks manager"
          },
          {
                    "key": "Ctrl+H",
                    "action": "History",
                    "description": "Open browsing history"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Clear Data",
                    "description": "Clear browsing data"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Incognito",
                    "description": "Open incognito window"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Developer Tools",
                    "description": "Open developer tools"
          },
          {
                    "key": "F12",
                    "action": "Developer Tools",
                    "description": "Open developer tools"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Console",
                    "description": "Open console tab"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Inspect Element",
                    "description": "Inspect element"
          },
          {
                    "key": "Ctrl+U",
                    "action": "View Source",
                    "description": "View page source"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Device Mode",
                    "description": "Toggle device mode"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Command Menu",
                    "description": "Open command menu"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Screenshot",
                    "description": "Take screenshot"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Extensions",
                    "description": "Manage extensions"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bookmarks Bar",
                    "description": "Toggle bookmarks bar"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Apps",
                    "description": "Open Chrome apps"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Downloads",
                    "description": "Open downloads"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Chrome"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload All",
                    "description": "Reload all tabs"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close All",
                    "description": "Close all tabs"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current page"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save Page",
                    "description": "Save page as"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in browser"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "Go to Class",
                    "description": "Navigate to any class"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Go to File",
                    "description": "Navigate to any file"
          },
          {
                    "key": "Ctrl+Shift+Alt+N",
                    "action": "Go to Symbol",
                    "description": "Navigate to any symbol"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Go to Declaration",
                    "description": "Go to method/field declaration"
          },
          {
                    "key": "Ctrl+Alt+B",
                    "action": "Go to Implementation",
                    "description": "Go to implementation"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Maximize Editor",
                    "description": "Toggle full screen editor"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Recent Files",
                    "description": "Show recently opened files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Recent Locations",
                    "description": "Show recent locations"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Find Action",
                    "description": "Find any action or setting"
          },
          {
                    "key": "Ctrl+Alt+L",
                    "action": "Reformat Code",
                    "description": "Format current file"
          },
          {
                    "key": "Ctrl+Alt+O",
                    "action": "Optimize Imports",
                    "description": "Organize import statements"
          },
          {
                    "key": "Ctrl+Alt+M",
                    "action": "Extract Method",
                    "description": "Extract selected code to method"
          },
          {
                    "key": "Ctrl+Alt+V",
                    "action": "Extract Variable",
                    "description": "Extract selected expression to variable"
          },
          {
                    "key": "Ctrl+Alt+C",
                    "action": "Extract Constant",
                    "description": "Extract selected expression to constant"
          },
          {
                    "key": "Ctrl+Alt+F",
                    "action": "Extract Field",
                    "description": "Extract selected expression to field"
          },
          {
                    "key": "Ctrl+Alt+P",
                    "action": "Extract Parameter",
                    "description": "Extract selected expression to parameter"
          },
          {
                    "key": "Ctrl+Shift+F6",
                    "action": "Rename",
                    "description": "Rename selected element"
          },
          {
                    "key": "Ctrl+F6",
                    "action": "Change Signature",
                    "description": "Change method signature"
          },
          {
                    "key": "Ctrl+Alt+Shift+T",
                    "action": "Refactor This",
                    "description": "Show refactoring options"
          },
          {
                    "key": "Ctrl+Shift+Backspace",
                    "action": "Go to Last Edit",
                    "description": "Go to last edit location"
          },
          {
                    "key": "Ctrl+Alt+Left",
                    "action": "Back",
                    "description": "Navigate back"
          },
          {
                    "key": "Ctrl+Alt+Right",
                    "action": "Forward",
                    "description": "Navigate forward"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find in Path",
                    "description": "Search across all files"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Replace",
                    "description": "Replace text"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Replace in Path",
                    "description": "Replace across all files"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find Usages",
                    "description": "Find usages of selected element"
          },
          {
                    "key": "Ctrl+Alt+F7",
                    "action": "Show Usages",
                    "description": "Show usages of selected element"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Highlight Usages",
                    "description": "Highlight usages in file"
          },
          {
                    "key": "Ctrl+Alt+F8",
                    "action": "Evaluate Expression",
                    "description": "Evaluate expression in debugger"
          },
          {
                    "key": "F9",
                    "action": "Toggle Breakpoint",
                    "description": "Toggle breakpoint"
          },
          {
                    "key": "F8",
                    "action": "Step Over",
                    "description": "Step over in debugger"
          },
          {
                    "key": "F7",
                    "action": "Step Into",
                    "description": "Step into in debugger"
          },
          {
                    "key": "Shift+F8",
                    "action": "Step Out",
                    "description": "Step out in debugger"
          },
          {
                    "key": "Ctrl+F8",
                    "action": "Resume Program",
                    "description": "Resume program execution"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "View Breakpoints",
                    "description": "View all breakpoints"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Run Context",
                    "description": "Run current context"
          },
          {
                    "key": "Shift+F10",
                    "action": "Run",
                    "description": "Run current configuration"
          },
          {
                    "key": "Ctrl+Shift+F10",
                    "action": "Run to Cursor",
                    "description": "Run to cursor position"
          },
          {
                    "key": "Ctrl+F2",
                    "action": "Stop",
                    "description": "Stop current process"
          },
          {
                    "key": "Ctrl+F5",
                    "action": "Debug",
                    "description": "Debug current configuration"
          },
          {
                    "key": "Ctrl+Shift+F5",
                    "action": "Debug to Cursor",
                    "description": "Debug to cursor position"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Find Action",
                    "description": "Find any action or setting"
          },
          {
                    "key": "Ctrl+Alt+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Alt+Shift+S",
                    "action": "Project Structure",
                    "description": "Open project structure"
          },
          {
                    "key": "Ctrl+Shift+Alt+S",
                    "action": "Module Settings",
                    "description": "Open module settings"
          },
          {
                    "key": "Ctrl+Alt+F12",
                    "action": "File Structure",
                    "description": "Show file structure"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Type Hierarchy",
                    "description": "Show type hierarchy"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Method Hierarchy",
                    "description": "Show method hierarchy"
          },
          {
                    "key": "Ctrl+Alt+H",
                    "action": "Call Hierarchy",
                    "description": "Show call hierarchy"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Maximize Editor",
                    "description": "Toggle full screen editor"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Maximize Editor",
                    "description": "Toggle full screen editor"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Maximize Editor",
                    "description": "Toggle full screen editor"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+W",
                    "action": "Close Tab",
                    "description": "Close current tab"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Q",
                    "action": "Quit",
                    "description": "Quit Edge"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open File",
                    "description": "Open file in browser"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save Page",
                    "description": "Save current page"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print current page"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected text"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select all text"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text on page"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Find Again",
                    "description": "Find next occurrence"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Find Previous",
                    "description": "Find previous occurrence"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Focus Address Bar",
                    "description": "Focus on address bar"
          },
          {
                    "key": "Ctrl+K",
                    "action": "Focus Search Bar",
                    "description": "Focus on search bar"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Focus Search Bar",
                    "description": "Focus on search bar"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Downloads",
                    "description": "Open downloads panel"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Console",
                    "description": "Open web console"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Inspector",
                    "description": "Open page inspector"
          },
          {
                    "key": "F12",
                    "action": "Developer Tools",
                    "description": "Open developer tools"
          },
          {
                    "key": "Ctrl+U",
                    "action": "View Source",
                    "description": "View page source"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Responsive Design",
                    "description": "Toggle responsive design mode"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Inspect Element",
                    "description": "Inspect element"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Screenshot",
                    "description": "Take screenshot"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Command Menu",
                    "description": "Open command menu"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Extensions",
                    "description": "Manage extensions"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bookmarks",
                    "description": "Toggle bookmarks bar"
          },
          {
                    "key": "Ctrl+D",
                    "action": "Bookmark Page",
                    "description": "Bookmark current page"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Bookmark All",
                    "description": "Bookmark all open tabs"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Bookmarks Manager",
                    "description": "Open bookmarks manager"
          },
          {
                    "key": "Ctrl+H",
                    "action": "History",
                    "description": "Open browsing history"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Clear Data",
                    "description": "Clear browsing data"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "InPrivate Window",
                    "description": "Open InPrivate window"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "InPrivate Window",
                    "description": "Open InPrivate window"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Add-ons",
                    "description": "Open add-ons manager"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Edge"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload All",
                    "description": "Reload all tabs"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close All",
                    "description": "Close all tabs"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current page"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save Page",
                    "description": "Save page as"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in browser"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mute Tab",
                    "description": "Mute/unmute current tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Turn Camera On/Off",
                    "description": "Toggle camera"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Share Screen",
                    "description": "Share your screen"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Raise Hand",
                    "description": "Raise hand in call"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Background Blur",
                    "description": "Toggle background blur"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Team",
                    "description": "Create new team"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Find People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Edge"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Edge"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in Edge"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save",
                    "description": "Save current item"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current item"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Workbook",
                    "description": "Create new workbook"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open",
                    "description": "Open existing workbook"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save",
                    "description": "Save current workbook"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save As",
                    "description": "Save workbook with new name"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print workbook"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected cells"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected cells"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select entire worksheet"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text in worksheet"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Replace",
                    "description": "Find and replace text"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go To",
                    "description": "Go to specific cell"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Bold",
                    "description": "Make selected text bold"
          },
          {
                    "key": "Ctrl+I",
                    "action": "Italic",
                    "description": "Make selected text italic"
          },
          {
                    "key": "Ctrl+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Ctrl+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Filter",
                    "description": "Apply filter to data"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Sort",
                    "description": "Sort data"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Number Format",
                    "description": "Apply number format"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Time Format",
                    "description": "Apply time format"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Date Format",
                    "description": "Apply date format"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Currency Format",
                    "description": "Apply currency format"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Percentage Format",
                    "description": "Apply percentage format"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Scientific Format",
                    "description": "Apply scientific format"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Fraction Format",
                    "description": "Apply fraction format"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Text Format",
                    "description": "Apply text format"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Custom Format",
                    "description": "Apply custom format"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "General Format",
                    "description": "Apply general format"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Array Formula",
                    "description": "Enter array formula"
          },
          {
                    "key": "Ctrl+Enter",
                    "action": "Fill Selected",
                    "description": "Fill selected cells with formula"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Calculate Sheet",
                    "description": "Calculate current worksheet"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide gridlines"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Select Current Region",
                    "description": "Select current data region"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy cell formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste cell formatting"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Format Cells",
                    "description": "Open format cells dialog"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Format Painter",
                    "description": "Format painter tool"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert Function",
                    "description": "Insert function"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Function Arguments",
                    "description": "Show function arguments"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Evaluate Formula",
                    "description": "Evaluate formula"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Expand Formula Bar",
                    "description": "Expand formula bar"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Wrap Text",
                    "description": "Wrap text in cell"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Merge Cells",
                    "description": "Merge selected cells"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Unmerge Cells",
                    "description": "Unmerge selected cells"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "AutoFit",
                    "description": "AutoFit column width"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Decrease Indent",
                    "description": "Decrease cell indent"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Increase Indent",
                    "description": "Increase cell indent"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Ctrl+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Function",
                    "description": "Insert function"
          },
          {
                    "key": "Ctrl+Shift+-",
                    "action": "Delete",
                    "description": "Delete selected cells"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert",
                    "description": "Insert new cells"
          },
          {
                    "key": "Ctrl+Shift+{",
                    "action": "Previous Sheet",
                    "description": "Go to previous worksheet"
          },
          {
                    "key": "Ctrl+Shift+}",
                    "action": "Next Sheet",
                    "description": "Go to next worksheet"
          },
          {
                    "key": "Ctrl+Shift+|",
                    "action": "Split Window",
                    "description": "Split window"
          },
          {
                    "key": "Ctrl+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+!",
                    "action": "Insert Row",
                    "description": "Insert new row"
          },
          {
                    "key": "Ctrl+Shift+@",
                    "action": "Insert Column",
                    "description": "Insert new column"
          },
          {
                    "key": "Ctrl+Shift+#",
                    "action": "Insert Sheet",
                    "description": "Insert new worksheet"
          },
          {
                    "key": "Ctrl+Shift+$",
                    "action": "Insert Chart",
                    "description": "Insert chart"
          },
          {
                    "key": "Ctrl+Shift+%",
                    "action": "Insert Picture",
                    "description": "Insert picture"
          },
          {
                    "key": "Ctrl+Shift+^",
                    "action": "Insert Shape",
                    "description": "Insert shape"
          },
          {
                    "key": "Ctrl+Shift+&",
                    "action": "Insert SmartArt",
                    "description": "Insert SmartArt"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Select Current Region",
                    "description": "Select current data region"
          },
          {
                    "key": "Ctrl+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Ctrl+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Ctrl+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Ctrl+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Ctrl+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Ctrl+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Email",
                    "description": "Create new email"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open",
                    "description": "Open selected email"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save",
                    "description": "Save current email"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save As",
                    "description": "Save email with new name"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print email"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected text"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select all text"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text in email"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Replace",
                    "description": "Find and replace text"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Bold",
                    "description": "Make selected text bold"
          },
          {
                    "key": "Ctrl+I",
                    "action": "Italic",
                    "description": "Make selected text italic"
          },
          {
                    "key": "Ctrl+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Ctrl+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Page Break",
                    "description": "Insert page break"
          },
          {
                    "key": "Ctrl+Enter",
                    "action": "Line Break",
                    "description": "Insert line break"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Section Break",
                    "description": "Insert section break"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps formatting"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Double underline text"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+=",
                    "action": "Subscript",
                    "description": "Apply subscript"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+F2",
                    "action": "Copy Text",
                    "description": "Copy selected text to spike"
          },
          {
                    "key": "Ctrl+F3",
                    "action": "Cut to Spike",
                    "description": "Cut selected text to spike"
          },
          {
                    "key": "Ctrl+Shift+F3",
                    "action": "Paste Spike",
                    "description": "Paste spike contents"
          },
          {
                    "key": "Ctrl+Shift+F5",
                    "action": "Bookmark",
                    "description": "Insert bookmark"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields in email"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection mode"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+Home",
                    "action": "Select to Start",
                    "description": "Select from cursor to start"
          },
          {
                    "key": "Ctrl+Shift+End",
                    "action": "Select to End",
                    "description": "Select from cursor to end"
          },
          {
                    "key": "Ctrl+Shift+Up",
                    "action": "Select Up",
                    "description": "Select text upward"
          },
          {
                    "key": "Ctrl+Shift+Down",
                    "action": "Select Down",
                    "description": "Select text downward"
          },
          {
                    "key": "Ctrl+Shift+Left",
                    "action": "Select Word Left",
                    "description": "Select word to left"
          },
          {
                    "key": "Ctrl+Shift+Right",
                    "action": "Select Word Right",
                    "description": "Select word to right"
          },
          {
                    "key": "Ctrl+Shift+Page Up",
                    "action": "Select Page Up",
                    "description": "Select text up one page"
          },
          {
                    "key": "Ctrl+Shift+Page Down",
                    "action": "Select Page Down",
                    "description": "Select text down one page"
          },
          {
                    "key": "Ctrl+Shift+Backspace",
                    "action": "Delete Word Left",
                    "description": "Delete word to left"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Delete Word Right",
                    "description": "Delete word to right"
          },
          {
                    "key": "Ctrl+Shift+Insert",
                    "action": "Paste Special",
                    "description": "Open paste special dialog"
          },
          {
                    "key": "Ctrl+Shift+F6",
                    "action": "Previous Window",
                    "description": "Switch to previous window"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F10",
                    "action": "Maximize Window",
                    "description": "Maximize email window"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bold",
                    "description": "Apply bold formatting"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Apply double underline"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Italic",
                    "description": "Apply italic formatting"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Reduce Indent",
                    "description": "Reduce paragraph indent"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Right Align",
                    "description": "Right align text"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Hanging Indent",
                    "description": "Create hanging indent"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Underline",
                    "description": "Apply underline"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Ctrl+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+Shift+-",
                    "action": "Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift+{",
                    "action": "Previous Field",
                    "description": "Go to previous field"
          },
          {
                    "key": "Ctrl+Shift+}",
                    "action": "Next Field",
                    "description": "Go to next field"
          },
          {
                    "key": "Ctrl+Shift+|",
                    "action": "Split Table",
                    "description": "Split table at cursor"
          },
          {
                    "key": "Ctrl+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+!",
                    "action": "Insert Footnote",
                    "description": "Insert footnote"
          },
          {
                    "key": "Ctrl+Shift+@",
                    "action": "Insert Endnote",
                    "description": "Insert endnote"
          },
          {
                    "key": "Ctrl+Shift+#",
                    "action": "Insert Symbol",
                    "description": "Insert symbol"
          },
          {
                    "key": "Ctrl+Shift+$",
                    "action": "Insert Field",
                    "description": "Insert field"
          },
          {
                    "key": "Ctrl+Shift+%",
                    "action": "Insert Page Number",
                    "description": "Insert page number"
          },
          {
                    "key": "Ctrl+Shift+^",
                    "action": "Insert Date and Time",
                    "description": "Insert date and time"
          },
          {
                    "key": "Ctrl+Shift+&",
                    "action": "Insert AutoText",
                    "description": "Insert AutoText entry"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Ctrl+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Ctrl+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Ctrl+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Ctrl+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Ctrl+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Presentation",
                    "description": "Create new presentation"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open",
                    "description": "Open existing presentation"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save",
                    "description": "Save current presentation"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save As",
                    "description": "Save presentation with new name"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print presentation"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected object"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected object"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select all objects on slide"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text in presentation"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Replace",
                    "description": "Find and replace text"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go To",
                    "description": "Go to specific slide"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Bold",
                    "description": "Make selected text bold"
          },
          {
                    "key": "Ctrl+I",
                    "action": "Italic",
                    "description": "Make selected text italic"
          },
          {
                    "key": "Ctrl+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Ctrl+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Slide",
                    "description": "Insert new slide"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Slide Break",
                    "description": "Insert slide break"
          },
          {
                    "key": "Ctrl+Enter",
                    "action": "Line Break",
                    "description": "Insert line break"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Section Break",
                    "description": "Insert section break"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps formatting"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Double underline text"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+=",
                    "action": "Subscript",
                    "description": "Apply subscript"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+F2",
                    "action": "Copy Text",
                    "description": "Copy selected text to spike"
          },
          {
                    "key": "Ctrl+F3",
                    "action": "Cut to Spike",
                    "description": "Cut selected text to spike"
          },
          {
                    "key": "Ctrl+Shift+F3",
                    "action": "Paste Spike",
                    "description": "Paste spike contents"
          },
          {
                    "key": "Ctrl+Shift+F5",
                    "action": "Bookmark",
                    "description": "Insert bookmark"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields in presentation"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection mode"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+Home",
                    "action": "Select to Start",
                    "description": "Select from cursor to start"
          },
          {
                    "key": "Ctrl+Shift+End",
                    "action": "Select to End",
                    "description": "Select from cursor to end"
          },
          {
                    "key": "Ctrl+Shift+Up",
                    "action": "Select Up",
                    "description": "Select text upward"
          },
          {
                    "key": "Ctrl+Shift+Down",
                    "action": "Select Down",
                    "description": "Select text downward"
          },
          {
                    "key": "Ctrl+Shift+Left",
                    "action": "Select Word Left",
                    "description": "Select word to left"
          },
          {
                    "key": "Ctrl+Shift+Right",
                    "action": "Select Word Right",
                    "description": "Select word to right"
          },
          {
                    "key": "Ctrl+Shift+Page Up",
                    "action": "Select Page Up",
                    "description": "Select text up one page"
          },
          {
                    "key": "Ctrl+Shift+Page Down",
                    "action": "Select Page Down",
                    "description": "Select text down one page"
          },
          {
                    "key": "Ctrl+Shift+Backspace",
                    "action": "Delete Word Left",
                    "description": "Delete word to left"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Delete Word Right",
                    "description": "Delete word to right"
          },
          {
                    "key": "Ctrl+Shift+Insert",
                    "action": "Paste Special",
                    "description": "Open paste special dialog"
          },
          {
                    "key": "Ctrl+Shift+F6",
                    "action": "Previous Window",
                    "description": "Switch to previous window"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F10",
                    "action": "Maximize Window",
                    "description": "Maximize presentation window"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bold",
                    "description": "Apply bold formatting"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Apply double underline"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Italic",
                    "description": "Apply italic formatting"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Reduce Indent",
                    "description": "Reduce paragraph indent"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Right Align",
                    "description": "Right align text"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Hanging Indent",
                    "description": "Create hanging indent"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Underline",
                    "description": "Apply underline"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Ctrl+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+Shift+-",
                    "action": "Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift+{",
                    "action": "Previous Field",
                    "description": "Go to previous field"
          },
          {
                    "key": "Ctrl+Shift+}",
                    "action": "Next Field",
                    "description": "Go to next field"
          },
          {
                    "key": "Ctrl+Shift+|",
                    "action": "Split Table",
                    "description": "Split table at cursor"
          },
          {
                    "key": "Ctrl+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+!",
                    "action": "Insert Footnote",
                    "description": "Insert footnote"
          },
          {
                    "key": "Ctrl+Shift+@",
                    "action": "Insert Endnote",
                    "description": "Insert endnote"
          },
          {
                    "key": "Ctrl+Shift+#",
                    "action": "Insert Symbol",
                    "description": "Insert symbol"
          },
          {
                    "key": "Ctrl+Shift+$",
                    "action": "Insert Field",
                    "description": "Insert field"
          },
          {
                    "key": "Ctrl+Shift+%",
                    "action": "Insert Page Number",
                    "description": "Insert page number"
          },
          {
                    "key": "Ctrl+Shift+^",
                    "action": "Insert Date and Time",
                    "description": "Insert date and time"
          },
          {
                    "key": "Ctrl+Shift+&",
                    "action": "Insert AutoText",
                    "description": "Insert AutoText entry"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Ctrl+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Ctrl+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Ctrl+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Ctrl+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Ctrl+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
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
          {
                    "key": "Ctrl+E",
                    "action": "Search",
                    "description": "Search for people, files, or messages"
          },
          {
                    "key": "Ctrl+1",
                    "action": "Activity",
                    "description": "Go to activity feed"
          },
          {
                    "key": "Ctrl+2",
                    "action": "Chat",
                    "description": "Go to chat"
          },
          {
                    "key": "Ctrl+3",
                    "action": "Teams",
                    "description": "Go to teams"
          },
          {
                    "key": "Ctrl+4",
                    "action": "Calendar",
                    "description": "Go to calendar"
          },
          {
                    "key": "Ctrl+5",
                    "action": "Calls",
                    "description": "Go to calls"
          },
          {
                    "key": "Ctrl+6",
                    "action": "Files",
                    "description": "Go to files"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "New Message",
                    "description": "Start new chat"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "New Meeting",
                    "description": "Schedule new meeting"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Accept Call",
                    "description": "Accept incoming call"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Decline Call",
                    "description": "Decline incoming call"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "End Call",
                    "description": "End current call"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mute/Unmute",
                    "description": "Toggle microphone"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Turn Camera On/Off",
                    "description": "Toggle camera"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Share Screen",
                    "description": "Share your screen"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Raise Hand",
                    "description": "Raise hand in meeting"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Background Blur",
                    "description": "Toggle background blur"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Team",
                    "description": "Create new team"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Find People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Teams"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Teams"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in Teams"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save",
                    "description": "Save current item"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current item"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          }
])
      },
      {
        name: "Microsoft Word",
        description: "Essential shortcuts for document creation",
        author_id: sampleUserId,
        author_name: "TechGuru",
        category: "Productivity",
        image_url: "/images/word-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "Ctrl+N",
                    "action": "New Document",
                    "description": "Create new document"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open",
                    "description": "Open existing document"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save",
                    "description": "Save current document"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save As",
                    "description": "Save document with new name"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print document"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected text"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select entire document"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text in document"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Replace",
                    "description": "Find and replace text"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go To",
                    "description": "Go to specific page or section"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Bold",
                    "description": "Make selected text bold"
          },
          {
                    "key": "Ctrl+I",
                    "action": "Italic",
                    "description": "Make selected text italic"
          },
          {
                    "key": "Ctrl+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Ctrl+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Page Break",
                    "description": "Insert page break"
          },
          {
                    "key": "Ctrl+Enter",
                    "action": "Column Break",
                    "description": "Insert column break"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Section Break",
                    "description": "Insert section break"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps formatting"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Double underline text"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+=",
                    "action": "Subscript",
                    "description": "Apply subscript"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+F2",
                    "action": "Copy Text",
                    "description": "Copy selected text to spike"
          },
          {
                    "key": "Ctrl+F3",
                    "action": "Cut to Spike",
                    "description": "Cut selected text to spike"
          },
          {
                    "key": "Ctrl+Shift+F3",
                    "action": "Paste Spike",
                    "description": "Paste spike contents"
          },
          {
                    "key": "Ctrl+Shift+F5",
                    "action": "Bookmark",
                    "description": "Insert bookmark"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields in document"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection mode"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+Home",
                    "action": "Select to Start",
                    "description": "Select from cursor to start"
          },
          {
                    "key": "Ctrl+Shift+End",
                    "action": "Select to End",
                    "description": "Select from cursor to end"
          },
          {
                    "key": "Ctrl+Shift+Up",
                    "action": "Select Up",
                    "description": "Select text upward"
          },
          {
                    "key": "Ctrl+Shift+Down",
                    "action": "Select Down",
                    "description": "Select text downward"
          },
          {
                    "key": "Ctrl+Shift+Left",
                    "action": "Select Word Left",
                    "description": "Select word to left"
          },
          {
                    "key": "Ctrl+Shift+Right",
                    "action": "Select Word Right",
                    "description": "Select word to right"
          },
          {
                    "key": "Ctrl+Shift+Page Up",
                    "action": "Select Page Up",
                    "description": "Select text up one page"
          },
          {
                    "key": "Ctrl+Shift+Page Down",
                    "action": "Select Page Down",
                    "description": "Select text down one page"
          },
          {
                    "key": "Ctrl+Shift+Backspace",
                    "action": "Delete Word Left",
                    "description": "Delete word to left"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Delete Word Right",
                    "description": "Delete word to right"
          },
          {
                    "key": "Ctrl+Shift+Insert",
                    "action": "Paste Special",
                    "description": "Open paste special dialog"
          },
          {
                    "key": "Ctrl+Shift+F6",
                    "action": "Previous Window",
                    "description": "Switch to previous window"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F10",
                    "action": "Maximize Window",
                    "description": "Maximize document window"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bold",
                    "description": "Apply bold formatting"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Apply double underline"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Italic",
                    "description": "Apply italic formatting"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Reduce Indent",
                    "description": "Reduce paragraph indent"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Right Align",
                    "description": "Right align text"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Hanging Indent",
                    "description": "Create hanging indent"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Underline",
                    "description": "Apply underline"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Ctrl+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+Shift+-",
                    "action": "Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift+{",
                    "action": "Previous Field",
                    "description": "Go to previous field"
          },
          {
                    "key": "Ctrl+Shift+}",
                    "action": "Next Field",
                    "description": "Go to next field"
          },
          {
                    "key": "Ctrl+Shift+|",
                    "action": "Split Table",
                    "description": "Split table at cursor"
          },
          {
                    "key": "Ctrl+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+!",
                    "action": "Insert Footnote",
                    "description": "Insert footnote"
          },
          {
                    "key": "Ctrl+Shift+@",
                    "action": "Insert Endnote",
                    "description": "Insert endnote"
          },
          {
                    "key": "Ctrl+Shift+#",
                    "action": "Insert Symbol",
                    "description": "Insert symbol"
          },
          {
                    "key": "Ctrl+Shift+$",
                    "action": "Insert Field",
                    "description": "Insert field"
          },
          {
                    "key": "Ctrl+Shift+%",
                    "action": "Insert Page Number",
                    "description": "Insert page number"
          },
          {
                    "key": "Ctrl+Shift+^",
                    "action": "Insert Date and Time",
                    "description": "Insert date and time"
          },
          {
                    "key": "Ctrl+Shift+&",
                    "action": "Insert AutoText",
                    "description": "Insert AutoText entry"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Ctrl+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Ctrl+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Ctrl+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Ctrl+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Ctrl+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+W",
                    "action": "Close Tab",
                    "description": "Close current tab"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Q",
                    "action": "Quit",
                    "description": "Quit Firefox"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open File",
                    "description": "Open file in browser"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save Page",
                    "description": "Save current page"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print current page"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected text"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select all text"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text on page"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Find Again",
                    "description": "Find next occurrence"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Find Previous",
                    "description": "Find previous occurrence"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Focus Address Bar",
                    "description": "Focus on address bar"
          },
          {
                    "key": "Ctrl+K",
                    "action": "Focus Search Bar",
                    "description": "Focus on search bar"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Focus Search Bar",
                    "description": "Focus on search bar"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Downloads",
                    "description": "Open downloads panel"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Console",
                    "description": "Open web console"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Inspector",
                    "description": "Open page inspector"
          },
          {
                    "key": "F12",
                    "action": "Developer Tools",
                    "description": "Open developer tools"
          },
          {
                    "key": "Ctrl+U",
                    "action": "View Source",
                    "description": "View page source"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Responsive Design",
                    "description": "Toggle responsive design mode"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Inspect Element",
                    "description": "Inspect element"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Screenshot",
                    "description": "Take screenshot"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Command Menu",
                    "description": "Open command menu"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Extensions",
                    "description": "Manage extensions"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bookmarks",
                    "description": "Toggle bookmarks bar"
          },
          {
                    "key": "Ctrl+D",
                    "action": "Bookmark Page",
                    "description": "Bookmark current page"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Bookmark All",
                    "description": "Bookmark all open tabs"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Bookmarks Manager",
                    "description": "Open bookmarks manager"
          },
          {
                    "key": "Ctrl+H",
                    "action": "History",
                    "description": "Open browsing history"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Clear Data",
                    "description": "Clear browsing data"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Private Window",
                    "description": "Open private window"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Private Window",
                    "description": "Open private window"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Add-ons",
                    "description": "Open add-ons manager"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Firefox"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload All",
                    "description": "Reload all tabs"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close All",
                    "description": "Close all tabs"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current page"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save Page",
                    "description": "Save page as"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in browser"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Mute Tab",
                    "description": "Mute/unmute current tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Turn Camera On/Off",
                    "description": "Toggle camera"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Share Screen",
                    "description": "Share your screen"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Raise Hand",
                    "description": "Raise hand in call"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Background Blur",
                    "description": "Toggle background blur"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Team",
                    "description": "Create new team"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Find People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Help",
                    "description": "Open help"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Firefox"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Firefox"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Close Window",
                    "description": "Close current window"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "New Tab",
                    "description": "Open new tab"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Open File",
                    "description": "Open file in Firefox"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save",
                    "description": "Save current item"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Print",
                    "description": "Print current item"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "About",
                    "description": "Show about dialog"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Version",
                    "description": "Show version info"
          }
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
          {
                    "key": "V",
                    "action": "Move Tool",
                    "description": "Select and move objects"
          },
          {
                    "key": "R",
                    "action": "Rectangle Tool",
                    "description": "Create rectangles and squares"
          },
          {
                    "key": "O",
                    "action": "Oval Tool",
                    "description": "Create circles and ellipses"
          },
          {
                    "key": "T",
                    "action": "Text Tool",
                    "description": "Add and edit text"
          },
          {
                    "key": "P",
                    "action": "Pencil Tool",
                    "description": "Draw freehand paths"
          },
          {
                    "key": "L",
                    "action": "Line Tool",
                    "description": "Create straight lines"
          },
          {
                    "key": "A",
                    "action": "Vector Tool",
                    "description": "Create vector shapes"
          },
          {
                    "key": "Cmd+D",
                    "action": "Duplicate",
                    "description": "Duplicate selected objects"
          },
          {
                    "key": "Cmd+G",
                    "action": "Group",
                    "description": "Group selected objects"
          },
          {
                    "key": "Cmd+Shift+G",
                    "action": "Ungroup",
                    "description": "Ungroup selected objects"
          },
          {
                    "key": "Cmd+Shift+O",
                    "action": "Create Outlines",
                    "description": "Convert text to outlines"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Expand",
                    "description": "Expand objects and effects"
          },
          {
                    "key": "Cmd+Shift+M",
                    "action": "Make Mask",
                    "description": "Create clipping mask"
          },
          {
                    "key": "Cmd+7",
                    "action": "Make Clipping Mask",
                    "description": "Create clipping mask"
          },
          {
                    "key": "Cmd+Shift+7",
                    "action": "Release Clipping Mask",
                    "description": "Release clipping mask"
          },
          {
                    "key": "Cmd+Shift+F",
                    "action": "Bring to Front",
                    "description": "Bring object to front"
          },
          {
                    "key": "Cmd+Shift+B",
                    "action": "Send to Back",
                    "description": "Send object to back"
          },
          {
                    "key": "Cmd+Shift+]",
                    "action": "Bring Forward",
                    "description": "Bring object forward"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Send Backward",
                    "description": "Send object backward"
          },
          {
                    "key": "Cmd+Shift+U",
                    "action": "Union",
                    "description": "Combine shapes with union"
          },
          {
                    "key": "Cmd+Shift+S",
                    "action": "Subtract",
                    "description": "Subtract shapes"
          },
          {
                    "key": "Cmd+Shift+X",
                    "action": "Intersect",
                    "description": "Intersect shapes"
          },
          {
                    "key": "Cmd+Shift+E",
                    "action": "Exclude",
                    "description": "Exclude overlapping areas"
          },
          {
                    "key": "Cmd+Shift+A",
                    "action": "Select All",
                    "description": "Select all objects"
          },
          {
                    "key": "Cmd+Shift+D",
                    "action": "Deselect All",
                    "description": "Deselect all objects"
          },
          {
                    "key": "Cmd+Shift+L",
                    "action": "Select Same",
                    "description": "Select objects with same properties"
          },
          {
                    "key": "Cmd+Shift+H",
                    "action": "Select Inverse",
                    "description": "Invert selection"
          },
          {
                    "key": "Cmd+Shift+J",
                    "action": "Bring to Front",
                    "description": "Bring object to front"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Send to Back",
                    "description": "Send object to back"
          },
          {
                    "key": "Cmd+Shift+]",
                    "action": "Bring Forward",
                    "description": "Bring object forward"
          },
          {
                    "key": "Cmd+Shift+[",
                    "action": "Send Backward",
                    "description": "Send object backward"
          },
          {
                    "key": "Cmd+Shift+M",
                    "action": "Mask",
                    "description": "Create mask from selection"
          },
          {
                    "key": "Cmd+Shift+U",
                    "action": "Use as Mask",
                    "description": "Use selection as mask"
          },
          {
                    "key": "Cmd+Shift+P",
                    "action": "Paste Over Selection",
                    "description": "Paste over selected object"
          },
          {
                    "key": "Cmd+Shift+V",
                    "action": "Paste in Place",
                    "description": "Paste in original position"
          },
          {
                    "key": "Cmd+Shift+C",
                    "action": "Copy Properties",
                    "description": "Copy object properties"
          },
          {
                    "key": "Cmd+Shift+B",
                    "action": "Paste Properties",
                    "description": "Paste object properties"
          },
          {
                    "key": "Cmd+Shift+N",
                    "action": "Create Component",
                    "description": "Create component from selection"
          },
          {
                    "key": "Cmd+Shift+K",
                    "action": "Detach Instance",
                    "description": "Detach component instance"
          },
          {
                    "key": "Cmd+Shift+R",
                    "action": "Reset Instance",
                    "description": "Reset component instance"
          }
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
          {
                    "key": "Ctrl+K",
                    "action": "Quick Switcher",
                    "description": "Switch between channels and DMs"
          },
          {
                    "key": "Ctrl+T",
                    "action": "Jump to Recent",
                    "description": "Jump to recent conversations"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Browse Channels",
                    "description": "Browse all channels"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Browse Direct Messages",
                    "description": "Browse all DMs"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "All Unread",
                    "description": "View all unread messages"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Threads",
                    "description": "View all threads"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "All Snippets",
                    "description": "View all snippets"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Search Files",
                    "description": "Search for files"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Search People",
                    "description": "Search for people"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Search Messages",
                    "description": "Search messages"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Preferences",
                    "description": "Open preferences"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "User Settings",
                    "description": "Open user settings"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Workspace Settings",
                    "description": "Open workspace settings"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Message",
                    "description": "Start new message"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "New Channel",
                    "description": "Create new channel"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "New DM",
                    "description": "Start new direct message"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "New Group DM",
                    "description": "Start new group DM"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "History",
                    "description": "View message history"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Jump to Date",
                    "description": "Jump to specific date"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bookmarks",
                    "description": "View bookmarks"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "View Profile",
                    "description": "View user profile"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Edit Profile",
                    "description": "Edit your profile"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Status",
                    "description": "Set your status"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Quit",
                    "description": "Quit Slack"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Reload",
                    "description": "Reload Slack"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Toggle Theme",
                    "description": "Switch between light/dark theme"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Toggle Sidebar",
                    "description": "Show/hide sidebar"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Toggle Emoji",
                    "description": "Show/hide emoji picker"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Toggle Mentions",
                    "description": "Show/hide mentions"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Toggle Pinned",
                    "description": "Show/hide pinned items"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Toggle Starred",
                    "description": "Show/hide starred items"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Toggle Apps",
                    "description": "Show/hide apps"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Toggle Help",
                    "description": "Show/hide help"
          }
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
          {
                    "key": "Ctrl+N",
                    "action": "New Stream",
                    "description": "Start new stream"
          },
          {
                    "key": "Ctrl+O",
                    "action": "Open Settings",
                    "description": "Open stream settings"
          },
          {
                    "key": "Ctrl+S",
                    "action": "Save Settings",
                    "description": "Save current settings"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Save As",
                    "description": "Save settings with new name"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Print",
                    "description": "Print stream info"
          },
          {
                    "key": "Ctrl+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+C",
                    "action": "Copy",
                    "description": "Copy selected text"
          },
          {
                    "key": "Ctrl+V",
                    "action": "Paste",
                    "description": "Paste from clipboard"
          },
          {
                    "key": "Ctrl+A",
                    "action": "Select All",
                    "description": "Select all text"
          },
          {
                    "key": "Ctrl+F",
                    "action": "Find",
                    "description": "Find text in chat"
          },
          {
                    "key": "Ctrl+H",
                    "action": "Replace",
                    "description": "Find and replace text"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Bold",
                    "description": "Make selected text bold"
          },
          {
                    "key": "Ctrl+I",
                    "action": "Italic",
                    "description": "Make selected text italic"
          },
          {
                    "key": "Ctrl+U",
                    "action": "Underline",
                    "description": "Underline selected text"
          },
          {
                    "key": "Ctrl+Shift+<",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+>",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Format Painter",
                    "description": "Copy formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Formatting",
                    "description": "Paste formatting"
          },
          {
                    "key": "Ctrl+L",
                    "action": "Left Align",
                    "description": "Align text to left"
          },
          {
                    "key": "Ctrl+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+R",
                    "action": "Right Align",
                    "description": "Align text to right"
          },
          {
                    "key": "Ctrl+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Page Break",
                    "description": "Insert page break"
          },
          {
                    "key": "Ctrl+Enter",
                    "action": "Line Break",
                    "description": "Insert line break"
          },
          {
                    "key": "Ctrl+Shift+Enter",
                    "action": "Section Break",
                    "description": "Insert section break"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps formatting"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Double underline text"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+=",
                    "action": "Subscript",
                    "description": "Apply subscript"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+F2",
                    "action": "Copy Text",
                    "description": "Copy selected text to spike"
          },
          {
                    "key": "Ctrl+F3",
                    "action": "Cut to Spike",
                    "description": "Cut selected text to spike"
          },
          {
                    "key": "Ctrl+Shift+F3",
                    "action": "Paste Spike",
                    "description": "Paste spike contents"
          },
          {
                    "key": "Ctrl+Shift+F5",
                    "action": "Bookmark",
                    "description": "Insert bookmark"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields in stream"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection mode"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+Home",
                    "action": "Select to Start",
                    "description": "Select from cursor to start"
          },
          {
                    "key": "Ctrl+Shift+End",
                    "action": "Select to End",
                    "description": "Select from cursor to end"
          },
          {
                    "key": "Ctrl+Shift+Up",
                    "action": "Select Up",
                    "description": "Select text upward"
          },
          {
                    "key": "Ctrl+Shift+Down",
                    "action": "Select Down",
                    "description": "Select text downward"
          },
          {
                    "key": "Ctrl+Shift+Left",
                    "action": "Select Word Left",
                    "description": "Select word to left"
          },
          {
                    "key": "Ctrl+Shift+Right",
                    "action": "Select Word Right",
                    "description": "Select word to right"
          },
          {
                    "key": "Ctrl+Shift+Page Up",
                    "action": "Select Page Up",
                    "description": "Select text up one page"
          },
          {
                    "key": "Ctrl+Shift+Page Down",
                    "action": "Select Page Down",
                    "description": "Select text down one page"
          },
          {
                    "key": "Ctrl+Shift+Backspace",
                    "action": "Delete Word Left",
                    "description": "Delete word to left"
          },
          {
                    "key": "Ctrl+Shift+Delete",
                    "action": "Delete Word Right",
                    "description": "Delete word to right"
          },
          {
                    "key": "Ctrl+Shift+Insert",
                    "action": "Paste Special",
                    "description": "Open paste special dialog"
          },
          {
                    "key": "Ctrl+Shift+F6",
                    "action": "Previous Window",
                    "description": "Switch to previous window"
          },
          {
                    "key": "Ctrl+Shift+F7",
                    "action": "Update Fields",
                    "description": "Update all fields"
          },
          {
                    "key": "Ctrl+Shift+F8",
                    "action": "Extend Selection",
                    "description": "Extend selection"
          },
          {
                    "key": "Ctrl+Shift+F9",
                    "action": "Unlink Fields",
                    "description": "Unlink all fields"
          },
          {
                    "key": "Ctrl+Shift+F10",
                    "action": "Maximize Window",
                    "description": "Maximize stream window"
          },
          {
                    "key": "Ctrl+Shift+F11",
                    "action": "Lock Fields",
                    "description": "Lock all fields"
          },
          {
                    "key": "Ctrl+Shift+F12",
                    "action": "Print Preview",
                    "description": "Open print preview"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Heading 1",
                    "description": "Apply heading 1 style"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Heading 2",
                    "description": "Apply heading 2 style"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Heading 3",
                    "description": "Apply heading 3 style"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Heading 4",
                    "description": "Apply heading 4 style"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Heading 5",
                    "description": "Apply heading 5 style"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Heading 6",
                    "description": "Apply heading 6 style"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Heading 7",
                    "description": "Apply heading 7 style"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Heading 8",
                    "description": "Apply heading 8 style"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Heading 9",
                    "description": "Apply heading 9 style"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Normal",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "All Caps",
                    "description": "Apply all caps formatting"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Bold",
                    "description": "Apply bold formatting"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Copy Format",
                    "description": "Copy text formatting"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Double Underline",
                    "description": "Apply double underline"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Center Align",
                    "description": "Center align text"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Font Dialog",
                    "description": "Open font dialog"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Go To",
                    "description": "Go to specific location"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Hidden Text",
                    "description": "Hide/show hidden text"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Italic",
                    "description": "Apply italic formatting"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Justify",
                    "description": "Justify text alignment"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Small Caps",
                    "description": "Apply small caps"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Bullet List",
                    "description": "Create bullet list"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Reduce Indent",
                    "description": "Reduce paragraph indent"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Normal Style",
                    "description": "Apply normal style"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Numbered List",
                    "description": "Create numbered list"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Paragraph Dialog",
                    "description": "Open paragraph dialog"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Symbol Font",
                    "description": "Apply symbol font"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Right Align",
                    "description": "Right align text"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Style Dialog",
                    "description": "Open style dialog"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Hanging Indent",
                    "description": "Create hanging indent"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Underline",
                    "description": "Apply underline"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Paste Format",
                    "description": "Paste text formatting"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Word Underline",
                    "description": "Underline words only"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Cut",
                    "description": "Cut selected text"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Redo",
                    "description": "Redo last undone action"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Undo",
                    "description": "Undo last action"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Decrease Font",
                    "description": "Decrease font size"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Increase Font",
                    "description": "Increase font size"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Date",
                    "description": "Insert current date"
          },
          {
                    "key": "Ctrl+Shift+:",
                    "action": "Insert Time",
                    "description": "Insert current time"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Superscript",
                    "description": "Apply superscript"
          },
          {
                    "key": "Ctrl+Shift+-",
                    "action": "Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift+{",
                    "action": "Previous Field",
                    "description": "Go to previous field"
          },
          {
                    "key": "Ctrl+Shift+}",
                    "action": "Next Field",
                    "description": "Go to next field"
          },
          {
                    "key": "Ctrl+Shift+|",
                    "action": "Split Table",
                    "description": "Split table at cursor"
          },
          {
                    "key": "Ctrl+Shift+~",
                    "action": "Toggle Case",
                    "description": "Toggle text case"
          },
          {
                    "key": "Ctrl+Shift+!",
                    "action": "Insert Footnote",
                    "description": "Insert footnote"
          },
          {
                    "key": "Ctrl+Shift+@",
                    "action": "Insert Endnote",
                    "description": "Insert endnote"
          },
          {
                    "key": "Ctrl+Shift+#",
                    "action": "Insert Symbol",
                    "description": "Insert symbol"
          },
          {
                    "key": "Ctrl+Shift+$",
                    "action": "Insert Field",
                    "description": "Insert field"
          },
          {
                    "key": "Ctrl+Shift+%",
                    "action": "Insert Page Number",
                    "description": "Insert page number"
          },
          {
                    "key": "Ctrl+Shift+^",
                    "action": "Insert Date and Time",
                    "description": "Insert date and time"
          },
          {
                    "key": "Ctrl+Shift+&",
                    "action": "Insert AutoText",
                    "description": "Insert AutoText entry"
          },
          {
                    "key": "Ctrl+Shift+*",
                    "action": "Show/Hide",
                    "description": "Show/hide formatting marks"
          },
          {
                    "key": "Ctrl+Shift+(",
                    "action": "Insert Comment",
                    "description": "Insert comment"
          },
          {
                    "key": "Ctrl+Shift+)",
                    "action": "Insert Hyperlink",
                    "description": "Insert hyperlink"
          },
          {
                    "key": "Ctrl+Shift+_",
                    "action": "Insert Non-breaking Space",
                    "description": "Insert non-breaking space"
          },
          {
                    "key": "Ctrl+Shift++",
                    "action": "Insert Non-breaking Hyphen",
                    "description": "Insert non-breaking hyphen"
          },
          {
                    "key": "Ctrl+Shift+=",
                    "action": "Insert Equals Sign",
                    "description": "Insert equals sign"
          },
          {
                    "key": "Ctrl+Shift+[",
                    "action": "Insert Left Bracket",
                    "description": "Insert left bracket"
          },
          {
                    "key": "Ctrl+Shift+]",
                    "action": "Insert Right Bracket",
                    "description": "Insert right bracket"
          },
          {
                    "key": "Ctrl+Shift+\\",
                    "action": "Insert Backslash",
                    "description": "Insert backslash"
          },
          {
                    "key": "Ctrl+Shift+;",
                    "action": "Insert Semicolon",
                    "description": "Insert semicolon"
          },
          {
                    "key": "Ctrl+Shift+'",
                    "action": "Insert Quote",
                    "description": "Insert quote"
          },
          {
                    "key": "Ctrl+Shift+,",
                    "action": "Insert Comma",
                    "description": "Insert comma"
          },
          {
                    "key": "Ctrl+Shift+.",
                    "action": "Insert Period",
                    "description": "Insert period"
          },
          {
                    "key": "Ctrl+Shift+/",
                    "action": "Insert Forward Slash",
                    "description": "Insert forward slash"
          },
          {
                    "key": "Ctrl+Shift+0",
                    "action": "Insert Zero",
                    "description": "Insert zero"
          },
          {
                    "key": "Ctrl+Shift+1",
                    "action": "Insert One",
                    "description": "Insert one"
          },
          {
                    "key": "Ctrl+Shift+2",
                    "action": "Insert Two",
                    "description": "Insert two"
          },
          {
                    "key": "Ctrl+Shift+3",
                    "action": "Insert Three",
                    "description": "Insert three"
          },
          {
                    "key": "Ctrl+Shift+4",
                    "action": "Insert Four",
                    "description": "Insert four"
          },
          {
                    "key": "Ctrl+Shift+5",
                    "action": "Insert Five",
                    "description": "Insert five"
          },
          {
                    "key": "Ctrl+Shift+6",
                    "action": "Insert Six",
                    "description": "Insert six"
          },
          {
                    "key": "Ctrl+Shift+7",
                    "action": "Insert Seven",
                    "description": "Insert seven"
          },
          {
                    "key": "Ctrl+Shift+8",
                    "action": "Insert Eight",
                    "description": "Insert eight"
          },
          {
                    "key": "Ctrl+Shift+9",
                    "action": "Insert Nine",
                    "description": "Insert nine"
          },
          {
                    "key": "Ctrl+Shift+A",
                    "action": "Insert A",
                    "description": "Insert letter A"
          },
          {
                    "key": "Ctrl+Shift+B",
                    "action": "Insert B",
                    "description": "Insert letter B"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Insert C",
                    "description": "Insert letter C"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Insert D",
                    "description": "Insert letter D"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Insert E",
                    "description": "Insert letter E"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Insert F",
                    "description": "Insert letter F"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Insert G",
                    "description": "Insert letter G"
          },
          {
                    "key": "Ctrl+Shift+H",
                    "action": "Insert H",
                    "description": "Insert letter H"
          },
          {
                    "key": "Ctrl+Shift+I",
                    "action": "Insert I",
                    "description": "Insert letter I"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Insert J",
                    "description": "Insert letter J"
          },
          {
                    "key": "Ctrl+Shift+K",
                    "action": "Insert K",
                    "description": "Insert letter K"
          },
          {
                    "key": "Ctrl+Shift+L",
                    "action": "Insert L",
                    "description": "Insert letter L"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Insert M",
                    "description": "Insert letter M"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "Insert N",
                    "description": "Insert letter N"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Insert O",
                    "description": "Insert letter O"
          },
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Insert P",
                    "description": "Insert letter P"
          },
          {
                    "key": "Ctrl+Shift+Q",
                    "action": "Insert Q",
                    "description": "Insert letter Q"
          },
          {
                    "key": "Ctrl+Shift+R",
                    "action": "Insert R",
                    "description": "Insert letter R"
          },
          {
                    "key": "Ctrl+Shift+S",
                    "action": "Insert S",
                    "description": "Insert letter S"
          },
          {
                    "key": "Ctrl+Shift+T",
                    "action": "Insert T",
                    "description": "Insert letter T"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Insert U",
                    "description": "Insert letter U"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Insert V",
                    "description": "Insert letter V"
          },
          {
                    "key": "Ctrl+Shift+W",
                    "action": "Insert W",
                    "description": "Insert letter W"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Insert X",
                    "description": "Insert letter X"
          },
          {
                    "key": "Ctrl+Shift+Y",
                    "action": "Insert Y",
                    "description": "Insert letter Y"
          },
          {
                    "key": "Ctrl+Shift+Z",
                    "action": "Insert Z",
                    "description": "Insert letter Z"
          }
])
      },
      {
        name: "VS Code Productivity",
        description: "Essential shortcuts for VS Code development",
        author_id: sampleUserId,
        author_name: "CodeMaster",
        category: "Development",
        image_url: "/images/vscode-logo.png",
        shortcuts: JSON.stringify([
          {
                    "key": "Ctrl+Shift+P",
                    "action": "Command Palette",
                    "description": "Open command palette"
          },
          {
                    "key": "Ctrl+P",
                    "action": "Quick Open",
                    "description": "Quick file navigation"
          },
          {
                    "key": "Ctrl+Shift+F",
                    "action": "Find in Files",
                    "description": "Search across all files"
          },
          {
                    "key": "Ctrl+/",
                    "action": "Toggle Comment",
                    "description": "Comment/uncomment line"
          },
          {
                    "key": "Alt+Shift+F",
                    "action": "Format Document",
                    "description": "Format entire document"
          },
          {
                    "key": "Ctrl+Space",
                    "action": "Trigger Suggestions",
                    "description": "Show IntelliSense"
          },
          {
                    "key": "F12",
                    "action": "Go to Definition",
                    "description": "Navigate to function definition"
          },
          {
                    "key": "Ctrl+Shift+O",
                    "action": "Go to Symbol",
                    "description": "Navigate to symbol in file"
          },
          {
                    "key": "Ctrl+G",
                    "action": "Go to Line",
                    "description": "Jump to specific line number"
          },
          {
                    "key": "Ctrl+Shift+M",
                    "action": "Problems Panel",
                    "description": "Show problems and errors"
          },
          {
                    "key": "Ctrl+Shift+E",
                    "action": "Explorer",
                    "description": "Focus on file explorer"
          },
          {
                    "key": "Ctrl+Shift+G",
                    "action": "Source Control",
                    "description": "Open source control panel"
          },
          {
                    "key": "Ctrl+Shift+D",
                    "action": "Run and Debug",
                    "description": "Open debug panel"
          },
          {
                    "key": "Ctrl+Shift+X",
                    "action": "Extensions",
                    "description": "Open extensions panel"
          },
          {
                    "key": "Ctrl+Shift+U",
                    "action": "Output",
                    "description": "Open output panel"
          },
          {
                    "key": "Ctrl+Shift+C",
                    "action": "Terminal",
                    "description": "Open integrated terminal"
          },
          {
                    "key": "Ctrl+Shift+J",
                    "action": "Toggle Panel",
                    "description": "Show/hide bottom panel"
          },
          {
                    "key": "Ctrl+B",
                    "action": "Toggle Sidebar",
                    "description": "Show/hide sidebar"
          },
          {
                    "key": "Ctrl+Shift+V",
                    "action": "Markdown Preview",
                    "description": "Open markdown preview"
          },
          {
                    "key": "Ctrl+K Ctrl+W",
                    "action": "Close All",
                    "description": "Close all editors"
          },
          {
                    "key": "Ctrl+K Ctrl+O",
                    "action": "Open Folder",
                    "description": "Open folder in workspace"
          },
          {
                    "key": "Ctrl+Shift+N",
                    "action": "New Window",
                    "description": "Open new window"
          },
          {
                    "key": "Ctrl+W",
                    "action": "Close Editor",
                    "description": "Close current editor"
          },
          {
                    "key": "Ctrl+Tab",
                    "action": "Next Editor",
                    "description": "Switch to next editor"
          },
          {
                    "key": "Ctrl+Shift+Tab",
                    "action": "Previous Editor",
                    "description": "Switch to previous editor"
          },
          {
                    "key": "Ctrl+PageUp",
                    "action": "Previous Tab",
                    "description": "Go to previous tab"
          },
          {
                    "key": "Ctrl+PageDown",
                    "action": "Next Tab",
                    "description": "Go to next tab"
          },
          {
                    "key": "Ctrl+K Ctrl+S",
                    "action": "Keyboard Shortcuts",
                    "description": "Open keyboard shortcuts"
          },
          {
                    "key": "Ctrl+,",
                    "action": "Settings",
                    "description": "Open settings"
          },
          {
                    "key": "Ctrl+K Ctrl+T",
                    "action": "Color Theme",
                    "description": "Change color theme"
          },
          {
                    "key": "Ctrl+K Ctrl+F",
                    "action": "File Icon Theme",
                    "description": "Change file icon theme"
          }
])
      },
      {
        name: "Zoom",
        description: "Video conferencing and communication platform shortcuts for efficient remote collaboration",
        author_id: sampleUserId,
        author_name: "KeyWizard Team",
        category: "Communication",
        image_url: "/images/zoom-logo.png",
        shortcuts: JSON.stringify([
          {
            "key": "Ctrl+Shift+A",
            "action": "Mute/Unmute Audio",
            "description": "Toggle microphone on/off"
          },
          {
            "key": "Ctrl+Shift+V",
            "action": "Start/Stop Video",
            "description": "Toggle camera on/off"
          },
          {
            "key": "Ctrl+Shift+R",
            "action": "Start/Stop Recording",
            "description": "Start or stop meeting recording"
          },
          {
            "key": "Ctrl+Shift+C",
            "action": "Chat",
            "description": "Open chat panel"
          },
          {
            "key": "Ctrl+Shift+P",
            "action": "Participants",
            "description": "Show participants list"
          },
          {
            "key": "Ctrl+Shift+S",
            "action": "Share Screen",
            "description": "Start screen sharing"
          },
          {
            "key": "Ctrl+Shift+W",
            "action": "Switch Camera",
            "description": "Switch between cameras"
          },
          {
            "key": "Ctrl+Shift+T",
            "action": "Touch Up My Appearance",
            "description": "Enable beauty filter"
          },
          {
            "key": "Ctrl+Shift+O",
            "action": "Virtual Background",
            "description": "Change virtual background"
          },
          {
            "key": "Ctrl+Shift+M",
            "action": "Minimize Meeting",
            "description": "Minimize meeting window"
          }
        ])
      },
      {
        name: "Notion",
        description: "All-in-one workspace for notes, docs, and project management shortcuts",
        author_id: sampleUserId,
        author_name: "KeyWizard Team",
        category: "Productivity",
        image_url: "/images/notion-logo.png",
        shortcuts: JSON.stringify([
          {
            "key": "Ctrl+N",
            "action": "New Page",
            "description": "Create a new page"
          },
          {
            "key": "Ctrl+Shift+N",
            "action": "New Database",
            "description": "Create a new database"
          },
          {
            "key": "Ctrl+E",
            "action": "Search",
            "description": "Search across workspace"
          },
          {
            "key": "Ctrl+Shift+E",
            "action": "Export",
            "description": "Export current page"
          },
          {
            "key": "Ctrl+Shift+L",
            "action": "Toggle Sidebar",
            "description": "Show/hide sidebar"
          },
          {
            "key": "Ctrl+Shift+P",
            "action": "Command Palette",
            "description": "Open command palette"
          },
          {
            "key": "Ctrl+Shift+U",
            "action": "Toggle Full Width",
            "description": "Toggle full width view"
          },
          {
            "key": "Ctrl+Shift+T",
            "action": "Toggle Table of Contents",
            "description": "Show/hide table of contents"
          },
          {
            "key": "Ctrl+Shift+F",
            "action": "Find in Page",
            "description": "Search within current page"
          },
          {
            "key": "Ctrl+Shift+C",
            "action": "Copy Link",
            "description": "Copy page link"
          }
        ])
      },
      {
        name: "GitHub Desktop",
        description: "Git client for Windows and macOS with visual interface shortcuts",
        author_id: sampleUserId,
        author_name: "KeyWizard Team",
        category: "Development",
        image_url: "/images/github-desktop-logo.png",
        shortcuts: JSON.stringify([
          {
            "key": "Ctrl+N",
            "action": "New Repository",
            "description": "Create a new repository"
          },
          {
            "key": "Ctrl+O",
            "action": "Add Local Repository",
            "description": "Add existing local repository"
          },
          {
            "key": "Ctrl+Shift+O",
            "action": "Clone Repository",
            "description": "Clone repository from GitHub"
          },
          {
            "key": "Ctrl+Shift+P",
            "action": "Push",
            "description": "Push commits to remote"
          },
          {
            "key": "Ctrl+Shift+L",
            "action": "Pull",
            "description": "Pull latest changes"
          },
          {
            "key": "Ctrl+Shift+C",
            "action": "Commit",
            "description": "Create a new commit"
          },
          {
            "key": "Ctrl+Shift+B",
            "action": "Create Branch",
            "description": "Create a new branch"
          },
          {
            "key": "Ctrl+Shift+M",
            "action": "Merge Branch",
            "description": "Merge current branch"
          },
          {
            "key": "Ctrl+Shift+R",
            "action": "Revert Commit",
            "description": "Revert last commit"
          },
          {
            "key": "Ctrl+Shift+T",
            "action": "Open in Terminal",
            "description": "Open repository in terminal"
          }
        ])
      },
      {
        name: "Framer",
        description: "Design and prototyping tool for creating interactive interfaces shortcuts",
        author_id: sampleUserId,
        author_name: "KeyWizard Team",
        category: "Design",
        image_url: "/images/framer-logo.png",
        shortcuts: JSON.stringify([
          {
            "key": "Ctrl+N",
            "action": "New Project",
            "description": "Create a new project"
          },
          {
            "key": "Ctrl+O",
            "action": "Open Project",
            "description": "Open existing project"
          },
          {
            "key": "Ctrl+S",
            "action": "Save",
            "description": "Save current project"
          },
          {
            "key": "Ctrl+Shift+S",
            "action": "Save As",
            "description": "Save project with new name"
          },
          {
            "key": "Ctrl+Z",
            "action": "Undo",
            "description": "Undo last action"
          },
          {
            "key": "Ctrl+Y",
            "action": "Redo",
            "description": "Redo last undone action"
          },
          {
            "key": "Ctrl+D",
            "action": "Duplicate",
            "description": "Duplicate selected element"
          },
          {
            "key": "Ctrl+G",
            "action": "Group",
            "description": "Group selected elements"
          },
          {
            "key": "Ctrl+Shift+G",
            "action": "Ungroup",
            "description": "Ungroup selected elements"
          },
          {
            "key": "Ctrl+Shift+P",
            "action": "Preview",
            "description": "Preview current design"
          }
        ])
      }
    ];

    let addedCount = 0;
    let skippedCount = 0;
    let currentIndex = 0;

    function processNextPackage() {
      if (currentIndex >= packages.length) {
        console.log(`Migration complete! Added/Updated ${addedCount} packages.`);
        db.close();
        return;
      }

      const pkg = packages[currentIndex];
      
      // Check if package already exists
      db.get('SELECT id FROM shortcut_packages WHERE name = ?', [pkg.name], (err, existing) => {
        if (err) {
          console.error(`Error checking package ${pkg.name}:`, err.message);
          currentIndex++;
          processNextPackage();
          return;
        }

        if (existing) {
          // Update existing package with new shortcuts
          db.run(
            'UPDATE shortcut_packages SET description = ?, shortcuts = ?, image_url = ?, updated_at = datetime("now") WHERE name = ?',
            [pkg.description, pkg.shortcuts, pkg.image_url, pkg.name],
            function(err) {
              if (err) {
                console.error(`Error updating package ${pkg.name}:`, err.message);
              } else {
                console.log(`Updated package: ${pkg.name} with new shortcuts`);
                addedCount++;
              }
              currentIndex++;
              processNextPackage();
            }
          );
        } else {
          // Insert new package
          db.run(
            'INSERT INTO shortcut_packages (name, description, author_id, author_name, category, shortcuts, downloads, rating, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
            [pkg.name, pkg.description, pkg.author_id, pkg.author_name, pkg.category, pkg.shortcuts, 0, 0, pkg.image_url],
            function(err) {
              if (err) {
                console.error(`Error inserting package ${pkg.name}:`, err.message);
              } else {
                console.log(`Added package: ${pkg.name}`);
                addedCount++;
              }
              currentIndex++;
              processNextPackage();
            }
          );
        }
      });
    }

    // Start processing packages sequentially
    processNextPackage();
  }
}

module.exports = { migrateDatabase };